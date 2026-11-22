import { Readable } from 'node:stream';
import { invalid } from '@alphacorp/mail-engine';
import { users } from '../models/index.js';
import * as pages from '../views/pages.js';

// Each classification is a task of mosAIc's case; mosAIc decides against what that task needs.
export const CLASSIFICATIONS = { due: 'Plazos · O-17', signature: 'Firma · oferta BetaAI', record: 'Estado · expediente O-17' };
// Legal releases or discards what mosAIc held; it already sees every document of the case.
const REVIEWER = 'senior_legal';
// Vercel cuts request bodies at ~4.5 MB; refusing earlier gives a clear message instead of a 413 from the platform.
const MAX_BODY = 4_500_000;

const isReviewer = (user) => user.role === REVIEWER;
const directory = () => Object.fromEntries(users.all().map((u) => [u.id, u]));

function engine(req, res) {
  const { mail } = req.app.locals;
  if (!mail) pages.render(res, 'Correo', req.user, pages.message('Configura MOSAIC_URL para usar el correo.'), 503);
  return mail;
}

// Every mail page shares the folder sidebar and its counters.
function box(req, res, mail, title, folder, content, status = 200) {
  const reviewer = isReviewer(req.user);
  const counts = { inbox: mail.unread(req.user.id), held: reviewer ? mail.held().length : null };
  pages.render(res, title, req.user, pages.mailbox({ title, folder, counts, content }), status);
}

const folder = (key, title, list) => (req, res) => {
  const mail = engine(req, res);
  if (!mail) return;
  if (key === 'held' && !isReviewer(req.user)) return box(req, res, mail, 'No disponible', key, pages.message('Solo Legal revisa los correos retenidos.'), 404);
  box(req, res, mail, title, key, pages.mailList(key, list(mail, req.user), directory(), CLASSIFICATIONS));
};

export const inbox = folder('inbox', 'Recibidos', (mail, user) => mail.inbox(user.id));
export const sent = folder('sent', 'Enviados', (mail, user) => mail.sent(user.id));
export const held = folder('held', 'Retenidos por mosAIc', (mail) => mail.held());

function renderCompose(req, res, mail, { notice, draft = {} } = {}, status = 200) {
  const people = users.all().filter((u) => u.id !== req.user.id);
  box(req, res, mail, 'Nuevo correo', 'compose', pages.compose({ people, classifications: CLASSIFICATIONS, notice, draft }), status);
}

export function composeForm(req, res) {
  const mail = engine(req, res);
  if (mail) renderCompose(req, res, mail);
}

// Multipart parsing with the platform's Request.formData; returns null when the body is too large or malformed.
async function readForm(req) {
  const length = Number(req.headers['content-length']);
  if (!req.is('multipart/form-data') || !(length <= MAX_BODY)) return null;
  try {
    return await new Request('http://intranet.local', {
      method: 'POST', headers: { 'content-type': req.headers['content-type'] }, body: Readable.toWeb(req), duplex: 'half',
    }).formData();
  } catch {
    return null;
  }
}

export async function send(req, res) {
  const mail = engine(req, res);
  if (!mail) return;
  const form = await readForm(req);
  if (!form) return renderCompose(req, res, mail, { notice: 'El correo supera 4 MB o el formulario no es válido.' }, 413);
  const draft = { task: String(form.get('task') ?? ''), to: form.getAll('to').map(String),
    subject: String(form.get('subject') ?? ''), body: String(form.get('body') ?? '') };
  const retry = (notice) => renderCompose(req, res, mail, { notice, draft }, 400);
  if (!Object.hasOwn(CLASSIFICATIONS, draft.task)) return retry('Elige una clasificación.');
  if (draft.to.some((id) => !users.find(id))) return retry('Destinatario desconocido.');
  // Browsers send an empty file part when nothing is picked.
  const files = form.getAll('files').filter((f) => typeof f !== 'string' && f.size > 0);
  const attachments = await Promise.all(files.map(async (f) => ({ name: f.name, media_type: f.type, data: Buffer.from(await f.arrayBuffer()) })));
  const email = { sender: req.user.id, ...draft, attachments };
  const error = invalid(email);
  if (error) return retry(error);
  const id = await mail.send(email);
  res.redirect(`/correo/${id}`);
}

export function show(req, res) {
  const mail = engine(req, res);
  if (!mail) return;
  const reviewer = isReviewer(req.user);
  const email = mail.view(req.user.id, req.params.id, { reviewer });
  if (!email) return box(req, res, mail, 'No disponible', null, pages.message('El correo no existe o no te llegó.'), 404);
  if (email.sender !== req.user.id) mail.markRead(req.user.id, email.id);
  const from = email.sender === req.user.id ? 'sent' : email.deliveries ? 'held' : 'inbox';
  box(req, res, mail, email.subject, from, pages.mailView(email, directory(), CLASSIFICATIONS, req.user, reviewer));
}

export function attachment(req, res) {
  const mail = engine(req, res);
  if (!mail) return;
  const file = mail.attachment(req.user.id, req.params.id, { reviewer: isReviewer(req.user) });
  if (!file) return pages.render(res, 'No disponible', req.user, pages.message('El adjunto no existe o no te llegó.'), 404);
  res.type(file.media_type).set({
    'content-disposition': `inline; filename*=UTF-8''${encodeURIComponent(file.name)}`, 'x-content-type-options': 'nosniff',
  }).send(Buffer.from(file.data));
}

const ACTIONS = {
  reintentar: (mail, user, id) => mail.retry(user.id, id),
  liberar: (mail, user, id) => isReviewer(user) && mail.release(id),
  descartar: (mail, user, id) => isReviewer(user) && mail.discard(id),
};

export async function act(req, res) {
  const mail = engine(req, res);
  if (!mail) return;
  if (!Object.hasOwn(ACTIONS, req.params.action) || !(await ACTIONS[req.params.action](mail, req.user, req.params.id))) {
    return pages.render(res, 'No disponible', req.user, pages.message('No puedes hacer eso con esta entrega.'), 403);
  }
  // After a release or discard the reviewer may no longer see the email, so they go back to the held folder.
  res.redirect(req.params.action === 'reintentar' ? `/correo/${req.params.id.split(':')[0]}` : '/correo/retenidos');
}
