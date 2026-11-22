import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

// node --test runs each file in its own process, so the seed is chosen before the app loads.
process.env.INTRANET_SEED = 'vacuna';
const { createApp } = await import('../app.js');

const calls = [];
const fake = {
  async review(item) { calls.push(item); return { review_id: item.review_id, status: 'revise' }; },
  async deliverReview() { return { action: 'allow' }; },
};

let server, base;
before(async () => {
  server = createApp({ mosaic: fake }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const as = (user, path, body) => fetch(base + path, {
  method: body ? 'POST' : 'GET', body, headers: { cookie: `user=${user}` }, redirect: 'manual',
});

test('el seed de vacunas: comunicaciones no ve el informe de ensayos', async () => {
  assert.match(await (await as('ana', '/expedientes')).text(), /VX-Aurora/);
  assert.equal((await as('ana', '/documentos/informe_vxa')).status, 404);
});

test('los borradores de Ana se abren prellenados y mosAIc los retiene', async () => {
  const list = await (await as('ana', '/correo/borradores')).text();
  assert.match(list, /Datos para la nota de prensa/);
  assert.match(list, /Lo que se comenta en el laboratorio/);
  assert.doesNotMatch(await (await as('luis', '/correo')).text(), /Borradores/);
  const compose = await (await as('ana', '/correo/redactar?borrador=borrador-nota')).text();
  assert.match(compose, /value="Datos para la nota de prensa"/);
  assert.match(compose, /value="luis" checked/);
  const f = new FormData();
  [['to', 'luis'], ['task', 'prensa'], ['subject', 'Datos para la nota de prensa'], ['body', 'VX-Aurora ya está en fase III.']].forEach(([k, v]) => f.append(k, v));
  const id = (await as('ana', '/correo', f)).headers.get('location').split('/').at(-1);
  assert.equal(calls[0].user, 'luis');
  assert.equal((await as('luis', `/correo/${id}`)).status, 404);
  assert.match(await (await as('ana', `/correo/${id}`)).text(), /Retenido · en revisión Legal/);
});
