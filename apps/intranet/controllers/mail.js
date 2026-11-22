import { Readable } from 'node:stream';
import { invalid } from '@alphacorp/mail-engine';
import { users } from '../models/index.js';
import * as pages from '../views/pages.js';
import { TASKS } from './assistant.js';

// Legal releases or discards what mosAIc held; it already sees every document of the case.
const REVIEWER = 'senior_legal';
// Vercel cuts request bodies at ~4.5 MB; refusing earlier gives a clear message instead of a 413 from the platform.
const MAX_BODY = 4_500_000;

const isReviewer = (user) => user.role === REVIEWER;
const names = () => Object.fromEntries(users.all().map((u) => [u.id, u.name]));

function engine(req, res) {
  const { mail } = req.app.locals;
  if (!mail) pages.render(res, 'Correo', req.user, pages.message('Configura MOSAIC_URL para usar el correo.'), 503);
  return mail;
}

function renderIndex(req, res, mail, notice, status = 200) {
  pages.render(res, 'Correo', req.user, pages.mail({
    tasks: TASKS, users: users.all().filter((u) => u.id !== req.user.id), names: names(), notice,
    inbox: mail.inbox(req.user.id), sent: mail.sent(req.user.id), held: isReviewer(req.user) ? mail.held() : null,
  }), status);
}

export function index(req, res) {
  const mail = engine(req, res);
  if (mail) renderIndex(req, res, mail, req.query.aviso);
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
  if (!form) return renderIndex(req, res, mail, 'El correo supera 4 MB o el formulario no es válido.', 413);
  const task = String(form.get('task') ?? '');
  const to = form.getAll('to').map(String);
  if (!Object.hasOwn(TASKS, task)) return renderIndex(req, res, mail, 'Elige a qué tarea responde el correo.', 400);
  if (to.some((id) => !users.find(id))) return renderIndex(req, res, mail, 'Destinatario desconocido.', 400);
  // Browsers send an empty file part when nothing is picked.
  const files = form.getAll('files').filter((f) => typeof f !== 'string' && f.size > 0);
  const attachments = await Promise.all(files.map(async (f) => ({ name: f.name, media_type: f.type, data: Buffer.from(await f.arrayBuffer()) })));
  const email = { sender: req.user.id, to, task, body: String(form.get('body') ?? ''), attachments };
  const error = invalid(email);
  if (error) return renderIndex(req, res, mail, error, 400);
  const id = await mail.send(email);
  res.redirect(`/correo/${id}`);
}

export function show(req, res) {
  const mail = engine(req, res);
  if (!mail) return;
  const email = mail.view(req.user.id, req.params.id, { reviewer: isReviewer(req.user) });
  if (!email) return pages.render(res, 'No disponible', req.user, pages.message('El correo no existe o no te llegó.'), 404);
  pages.render(res, TASKS[email.task].question, req.user, pages.mailView(email, names(), req.user, isReviewer(req.user)));
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
  const action = ACTIONS[req.params.action];
  if (!Object.hasOwn(ACTIONS, req.params.action) || !(await action(mail, req.user, req.params.id))) {
    return pages.render(res, 'No disponible', req.user, pages.message('No puedes hacer eso con esta entrega.'), 403);
  }
  // After a release or discard the reviewer may no longer see the email, so they go back to the list.
  res.redirect(req.params.action === 'reintentar' ? `/correo/${req.params.id.split(':')[0]}` : '/correo');
}
