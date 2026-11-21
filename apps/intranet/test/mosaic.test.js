import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createApp } from '../app.js';

const calls = [];
let failing = false;
const fake = {
  async observe(observations) {
    if (failing) throw new Error('caído');
    calls.push(['observe', observations]);
    return { accepted: observations.length };
  },
  async message(item) {
    calls.push(['message', item]);
    return { request_id: item.request_id, action: 'review', text: null };
  },
  async inbox(user) {
    return { messages: [{ id: 'r1', text: `El trámite vence el viernes.` }] };
  },
};

let server, base;
before(async () => {
  server = createApp({ mosaic: fake }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
beforeEach(() => { calls.length = 0; failing = false; });

const as = (user, path, body) => fetch(base + path, {
  method: body ? 'POST' : 'GET', body: body && new URLSearchParams(body), headers: { cookie: `user=${user}` }, redirect: 'manual',
});

test('leer un documento registra la evidencia en mosAIc', async () => {
  assert.equal((await as('ines', '/documentos/acta_o17')).status, 200);
  assert.deepEqual(calls[0][1], [{
    origin: 'record_o17', user: 'ines', grade: 'read', resource: 'signature_record',
    at: new Date().toISOString().slice(0, 10), facts: [['o17', 'signature', 'signed']],
  }]);
});

test('si mosAIc falla, el documento no se muestra', async () => {
  failing = true;
  const res = await as('ines', '/documentos/acta_o17');
  assert.equal(res.status, 502);
  assert.doesNotMatch(await res.text(), /ya está firmado/);
});

test('el asistente envía el borrador a mosAIc y solo muestra la bandeja', async () => {
  const res = await as('ana', '/asistente', { task: 'record' });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get('location'), '/asistente?estado=review');
  const [kind, item] = calls[0];
  assert.equal(kind, 'message');
  assert.equal(item.user, 'ana');
  assert.equal(item.task, 'record');
  assert.equal(item.draft, 'El expediente O-17 ya está firmado.');
  const page = await (await as('ana', '/asistente?estado=review')).text();
  assert.match(page, /revisión humana/);
  assert.match(page, /El trámite vence el viernes\./);
  assert.doesNotMatch(page, /ya está firmado/);
});

test('el acta viaja como adjunto para que mosAIc la transcriba', async () => {
  assert.equal((await as('luis', '/asistente', { task: 'acta' })).status, 302);
  const [, item] = calls[0];
  assert.equal(item.task, 'record');
  assert.equal(item.draft, 'Te adjunto el acta.');
  assert.equal(item.attachments[0].media_type, 'image/png');
  assert.equal(Buffer.from(item.attachments[0].data, 'base64').subarray(1, 4).toString(), 'PNG');
});

test('rechaza tareas desconocidas sin llamar a mosAIc', async () => {
  assert.equal((await as('ana', '/asistente', { task: 'toString' })).status, 400);
  assert.equal(calls.length, 0);
});

test('sin MOSAIC_URL el asistente queda deshabilitado', async () => {
  const plain = createApp().listen(0);
  await new Promise((resolve) => plain.once('listening', resolve));
  const res = await fetch(`http://127.0.0.1:${plain.address().port}/asistente`, { headers: { cookie: 'user=ana' } });
  plain.close();
  assert.equal(res.status, 503);
});
