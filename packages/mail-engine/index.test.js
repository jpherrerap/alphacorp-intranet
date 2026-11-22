import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { beforeEach, test } from 'node:test';
import { invalid, LIMITS, mailEngine, reviewIdOf } from './index.js';

let calls, decide, delivery, failing, mail;
const mosaic = {
  async review(item) {
    calls.push(['review', item]);
    if (failing) throw new Error('mosAIc 503');
    return decide(item);
  },
  async deliverReview(id, user) {
    calls.push(['deliver', { id, user }]);
    return delivery;
  },
  async source(input) {
    calls.push(['source', input]);
    if (failing) throw new Error('mosAIc 503');
    return { accepted: true, proposals: 1 };
  },
};
beforeEach(() => {
  calls = []; failing = false;
  decide = () => ({ status: 'approved' });
  delivery = { action: 'allow' };
  mail = mailEngine({ db: new DatabaseSync(':memory:'), mosaic });
});

const pdf = { name: 'acta.pdf', media_type: 'application/pdf', data: Buffer.from('%PDF-1.4 firmado') };
const email = (extra) => ({ sender: 'ana', to: ['luis'], task: 'due', subject: 'Plazo', body: 'Vence el viernes.', attachments: [], ...extra });

test('mosAIc revisa el texto libre por destinatario y solo entrega lo aprobado', async () => {
  decide = ({ user }) => ({ ana: { status: 'approved' }, luis: { status: 'revise' }, ines: { status: 'rejected' } })[user];
  const id = await mail.send(email({ sender: 'sofia', to: ['ana', 'luis', 'ines', 'luis'] }));
  const reviews = calls.filter(([kind]) => kind === 'review').map(([, i]) => i);
  assert.deepEqual(reviews.map((i) => i.user), ['ana', 'luis', 'ines']);
  assert.deepEqual(reviews[0], { review_id: `${id}_ana`, user: 'ana', task: 'email', question: 'Plazo',
    text: 'Asunto: Plazo\n\nVence el viernes.', day: new Date().toISOString().slice(0, 10) });
  assert.deepEqual(calls.filter(([kind]) => kind === 'deliver').map(([, d]) => d), [{ id: `${id}_ana`, user: 'ana' }]);
  assert.equal(mail.view('ana', id).text, 'Vence el viernes.');
  assert.equal(mail.view('luis', id), undefined);
  assert.deepEqual(mail.inbox('ines'), []);
  assert.deepEqual(mail.sent('sofia')[0].deliveries.map((d) => [d.status, d.reason]),
    [['delivered', null], ['held', 'riesgo de inferencia'], ['held', 'adjunto no evaluable']]);
});

test('si la entrega pide reevaluar, el correo aprobado queda retenido', async () => {
  delivery = { action: 'review', text: null, reason: 'context_changed' };
  const id = await mail.send(email());
  assert.equal(mail.view('luis', id), undefined);
  assert.deepEqual(mail.held()[0].deliveries.map((d) => d.reason), ['requiere reevaluación']);
});

test('los adjuntos viajan en base64 y un correo retenido no expone sus archivos', async () => {
  decide = () => ({ status: 'revise' });
  const id = await mail.send(email({ attachments: [pdf] }));
  assert.deepEqual(calls[0][1].attachments, [{ name: 'acta.pdf', media_type: 'application/pdf', data: pdf.data.toString('base64') }]);
  assert.equal(mail.view('luis', id), undefined);
  const fileId = mail.view('ana', id).attachments[0].id;
  assert.equal(mail.attachment('luis', fileId), undefined);
  assert.equal(Buffer.from(mail.attachment('ana', fileId).data).toString(), '%PDF-1.4 firmado');
});

test('si mosAIc falla no se entrega; solo el remitente reintenta con el mismo request_id', async () => {
  failing = true;
  const id = await mail.send(email());
  const [d] = mail.sent('ana')[0].deliveries;
  assert.equal(d.status, 'error');
  assert.equal(mail.view('luis', id), undefined);
  failing = false;
  assert.equal(await mail.retry('luis', d.id), false);
  assert.equal(await mail.retry('ana', d.id), true);
  assert.equal(calls.filter(([kind]) => kind === 'review').at(-1)[1].review_id, reviewIdOf(d.id));
  assert.equal(mail.view('luis', id).text, 'Vence el viernes.');
  assert.equal(await mail.retry('ana', d.id), false);
});

test('liberar avisa a mosAIc antes de entregar; si falla, sigue retenido', async () => {
  decide = () => ({ status: 'revise' });
  const id = await mail.send(email({ attachments: [pdf] }));
  const [d] = mail.held()[0].deliveries;
  assert.ok(mail.view('sofia', id, { reviewer: true }));
  failing = true;
  await assert.rejects(mail.release(d.id));
  assert.equal(mail.view('luis', id), undefined);
  failing = false;
  assert.equal(await mail.release(d.id), true);
  assert.deepEqual(calls.at(-1), ['source', {
    origin: `mail_${id.replaceAll('-', '')}_luis`, at: new Date().toISOString().slice(0, 10),
    text: 'Asunto: Plazo\n\nVence el viernes.', recipients: ['luis'], accept: true,
  }]);
  assert.equal(mail.view('luis', id).attachments.length, 1);
  assert.deepEqual(mail.held(), []);
  assert.equal(mail.discard(d.id), false);
});

test('descartar deja el correo fuera de la bandeja', async () => {
  decide = () => ({ status: 'revise' });
  const id = await mail.send(email());
  assert.equal(mail.discard(`${id}:luis`), true);
  assert.equal(mail.view('luis', id), undefined);
  assert.equal(mail.view('sofia', id, { reviewer: true }), undefined);
});

test('valida los límites antes de llamar a mosAIc', () => {
  assert.equal(invalid(email()), null);
  assert.match(invalid(email({ body: '  ' })), /entre 1 y 4000/);
  assert.match(invalid(email({ subject: '' })), /asunto/);
  assert.match(invalid(email({ body: 'x'.repeat(3995) })), /contando el asunto/);
  assert.match(invalid(email({ to: [] })), /destinatario/);
  assert.match(invalid(email({ attachments: Array(5).fill(pdf) })), /Máximo 4/);
  assert.match(invalid(email({ attachments: [{ ...pdf, name: 'x.html', media_type: 'text/html' }] })), /no permitido/);
  assert.match(invalid(email({ attachments: [{ ...pdf, data: Buffer.alloc(LIMITS.totalBytes + 1) }] })), /4 MB/);
});

test('leído y no leído por destinatario', async () => {
  const id = await mail.send(email({ to: ['luis', 'ines'] }));
  assert.equal(mail.unread('luis'), 1);
  mail.markRead('luis', id);
  assert.equal(mail.unread('luis'), 0);
  assert.equal(mail.unread('ines'), 1);
  assert.ok(mail.inbox('luis')[0].read_at);
});

test('los correos de ejemplo se cargan una vez y no pasan por mosAIc', () => {
  const seed = [{ id: 's1', sender: 'ines', to: ['ana', 'luis'], task: 'general', subject: 'Reunión', body: 'Lunes 10:00.', at: '2026-11-18T14:30:00.000Z' }];
  mail.seed(seed);
  mail.seed(seed);
  assert.equal(calls.length, 0);
  assert.equal(mail.inbox('ana').length, 1);
  assert.deepEqual(mail.sent('ines')[0].deliveries.map((d) => [d.status, d.reason]), [['delivered', 'seed'], ['delivered', 'seed']]);
});
