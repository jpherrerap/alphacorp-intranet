import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createApp } from '../app.js';

const calls = [];
let action;
const fake = {
  async message(item) { calls.push(item); return { request_id: item.request_id, action, text: null }; },
  async source() { return { accepted: true, proposals: 1 }; },
};

let server, base;
before(async () => {
  server = createApp({ mosaic: fake }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
beforeEach(() => { calls.length = 0; action = 'allow'; });

const as = (user, path, body) => fetch(base + path, {
  method: body ? 'POST' : 'GET', body, headers: { cookie: `user=${user}` }, redirect: 'manual',
});

function form({ to = ['luis'], task = 'due', body = 'Te adjunto el acta.', files = [] } = {}) {
  const f = new FormData();
  to.forEach((u) => f.append('to', u));
  f.append('task', task);
  f.append('body', body);
  files.forEach(([name, type, data]) => f.append('files', new Blob([data], { type }), name));
  return f;
}

test('enviar con adjuntos: mosAIc decide y el destinatario recibe texto y archivo', async () => {
  const res = await as('ana', '/correo', form({ files: [['nota.mp3', 'audio/mpeg', 'ID3audio'], ['acta.png', 'image/png', 'PNG']] }));
  assert.equal(res.status, 302);
  const id = res.headers.get('location').split('/').at(-1);
  assert.equal(calls[0].user, 'luis');
  assert.equal(calls[0].task, 'due');
  assert.deepEqual(calls[0].attachments.map((a) => [a.name, a.media_type, Buffer.from(a.data, 'base64').toString()]),
    [['nota.mp3', 'audio/mpeg', 'ID3audio'], ['acta.png', 'image/png', 'PNG']]);
  const page = await (await as('luis', `/correo/${id}`)).text();
  assert.match(page, /Te adjunto el acta\./);
  assert.match(page, /<audio controls/);
  const fileId = /\/correo\/adjuntos\/([\w-]+)/.exec(page)[1];
  const file = await as('luis', `/correo/adjuntos/${fileId}`);
  assert.equal(file.headers.get('content-type'), 'audio/mpeg');
  assert.equal(await file.text(), 'ID3audio');
  assert.equal((await as('ines', `/correo/adjuntos/${fileId}`)).status, 404);
});

test('un correo retenido no llega; Legal lo libera', async () => {
  action = 'review';
  const id = (await as('ana', '/correo', form())).headers.get('location').split('/').at(-1);
  assert.equal((await as('luis', `/correo/${id}`)).status, 404);
  assert.match(await (await as('ana', `/correo/${id}`)).text(), /retenido por mosAIc/);
  const delivery = encodeURIComponent(`${id}:luis`);
  assert.equal((await as('ana', `/correo/entregas/${delivery}/liberar`, new URLSearchParams())).status, 403);
  assert.match(await (await as('sofia', '/correo')).text(), /Retenidos por mosAIc/);
  assert.equal((await as('sofia', `/correo/entregas/${delivery}/liberar`, new URLSearchParams())).status, 302);
  assert.equal((await as('luis', `/correo/${id}`)).status, 200);
});

test('rechaza adjuntos no permitidos y tareas desconocidas sin llamar a mosAIc', async () => {
  assert.equal((await as('ana', '/correo', form({ files: [['x.html', 'text/html', '<script>']] }))).status, 400);
  assert.equal((await as('ana', '/correo', form({ task: 'toString' }))).status, 400);
  assert.equal((await as('ana', '/correo', form({ to: ['nadie'] }))).status, 400);
  assert.equal((await as('ana', '/correo', form({ files: [['big.pdf', 'application/pdf', Buffer.alloc(4_600_000)]] }))).status, 413);
  assert.equal(calls.length, 0);
});
