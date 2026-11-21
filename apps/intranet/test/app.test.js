import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createApp } from '../app.js';

let server, base;
before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const get = (path, user) => fetch(base + path, { headers: user ? { cookie: `user=${user}` } : {}, redirect: 'manual' });

test('sin sesión redirige al login', async () => {
  const res = await get('/expedientes');
  assert.equal(res.status, 302);
  assert.equal(res.headers.get('location'), '/login');
});

test('el login fija la cookie del usuario', async () => {
  const res = await fetch(base + '/login', { method: 'POST', body: new URLSearchParams({ user: 'ana' }), redirect: 'manual' });
  assert.equal(res.status, 302);
  assert.match(res.headers.get('set-cookie'), /user=ana/);
  assert.equal((await fetch(base + '/login', { method: 'POST', body: new URLSearchParams({ user: 'x' }) })).status, 400);
});

test('ventas no ve el acta de firma; legal sí', async () => {
  assert.doesNotMatch(await (await get('/expedientes/o17', 'ana')).text(), /Acta de firma/);
  assert.equal((await get('/documentos/acta_o17', 'ana')).status, 404);
  const res = await get('/documentos/acta_o17', 'sofia');
  assert.equal(res.status, 200);
  assert.match(await res.text(), /ya está firmado/);
});

test('escapa el contenido en las vistas', async () => {
  assert.equal((await get('/expedientes/%3Cscript%3E', 'ana')).status, 404);
  assert.doesNotMatch(await (await get('/login')).text(), /<script/);
});
