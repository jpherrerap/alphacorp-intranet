import assert from 'node:assert/strict';
import { test } from 'node:test';
import { transportFrom } from './transport.js';

const env = { MAIL_TRANSPORT: 'resend', RESEND_API_KEY: 're_test', MAIL_TO: 'demo@example.com' };
const copy = { id: 'm1:luis', recipient: 'luis', status: 'repaired', subject: 'Plazo', text: 'Vence pronto.',
  files: [{ name: 'acta.pdf', data: Buffer.from('%PDF') }] };

test('mock es el valor por defecto y no envía nada', () => {
  assert.equal(transportFrom({}), undefined);
  assert.equal(transportFrom({ MAIL_TRANSPORT: 'mock' }), undefined);
});

test('resend envía una copia a la única casilla configurada', async () => {
  const calls = [];
  const send = transportFrom(env, async (url, init) => { calls.push([url, init]); return { ok: true }; });
  await send(copy);
  const [url, init] = calls[0];
  const body = JSON.parse(init.body);
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(init.headers.Authorization, 'Bearer re_test');
  assert.equal(init.headers['Idempotency-Key'], 'm1:luis');
  assert.deepEqual(body.to, ['demo@example.com']);
  assert.equal(body.subject, '[luis] Plazo');
  assert.match(body.text, /^Vence pronto\.\n\n— Para luis@alphacorp\.cl · reparado por mosAIc$/);
  assert.deepEqual(body.attachments, [{ filename: 'acta.pdf', content: Buffer.from('%PDF').toString('base64') }]);
});

test('un error de Resend se propaga con su detalle', async () => {
  const send = transportFrom(env, async () => ({ ok: false, status: 403, text: async () => 'dominio no verificado' }));
  await assert.rejects(send(copy), /Resend respondió 403: dominio no verificado/);
});

test('sin clave, sin casilla única o con un transporte desconocido no arranca', () => {
  assert.throws(() => transportFrom({ ...env, RESEND_API_KEY: '' }), /RESEND_API_KEY/);
  assert.throws(() => transportFrom({ ...env, MAIL_TO: undefined }), /MAIL_TO/);
  assert.throws(() => transportFrom({ ...env, MAIL_TO: 'a@x.com,b@y.com' }), /MAIL_TO/);
  assert.throws(() => transportFrom({ MAIL_TRANSPORT: 'smtp' }), /desconocido/);
});
