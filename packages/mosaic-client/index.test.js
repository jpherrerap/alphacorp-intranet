import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mosaicClient } from './index.js';

const fakeFetch = (status, data, calls) => async (url, init) => {
  calls.push({ url, ...init });
  return { ok: status < 400, status, statusText: 'x', json: async () => data };
};

test('envía JSON a la ruta de la API', async () => {
  const calls = [];
  const client = mosaicClient('http://mosaic.test/', fakeFetch(200, { accepted: 1 }, calls));
  assert.deepEqual(await client.observe([{ origin: 'a' }]), { accepted: 1 });
  await client.inbox('ana/x');
  await client.source({ origin: 'mail_x', accept: true });
  assert.equal(calls[0].url, 'http://mosaic.test/v1/observations');
  assert.deepEqual(JSON.parse(calls[0].body), { observations: [{ origin: 'a' }] });
  assert.equal(calls[1].url, 'http://mosaic.test/v1/inbox/ana%2Fx');
  assert.equal(calls[1].body, undefined);
  assert.equal(calls[2].url, 'http://mosaic.test/v1/sources');
  await client.review({ review_id: 'm_1' });
  await client.deliverReview('m_1', 'ana');
  assert.equal(calls[3].url, 'http://mosaic.test/v1/reviews');
  assert.equal(calls[4].url, 'http://mosaic.test/v1/reviews/m_1/deliver');
  assert.deepEqual(JSON.parse(calls[4].body), { user: 'ana' });
});

test('un error de mosAIc se propaga con su detalle', async () => {
  const client = mosaicClient('http://mosaic.test', fakeFetch(400, { detail: 'Tarea desconocida' }, []));
  await assert.rejects(client.message({}), /mosAIc 400: "Tarea desconocida"/);
});
