import express from 'express';
import { mosaicClient } from '@alphacorp/mosaic-client';
import * as session from './controllers/session.js';
import * as records from './controllers/records.js';
import * as assistant from './controllers/assistant.js';
import * as pages from './views/pages.js';

export function createApp({ mosaic = null } = {}) {
  const app = express();
  app.locals.mosaic = mosaic;
  app.use(express.urlencoded({ extended: false }));
  app.get('/', (req, res) => res.redirect('/expedientes'));
  app.get('/login', session.loginForm);
  app.post('/login', session.login);
  app.post('/logout', session.logout);
  app.use(session.current);
  app.get('/expedientes', records.index);
  app.get('/expedientes/:id', records.show);
  app.get('/documentos/:id', records.openDocument);
  app.get('/asistente', assistant.index);
  app.post('/asistente', assistant.ask);
  app.use((err, req, res, next) => {
    console.error(err);
    pages.render(res, 'Error', req.user, pages.message('mosAIc no respondió. No se mostró ni entregó nada.'), 502);
  });
  return app;
}

// Vercel's Express runtime serves this default export; dev.js listens locally.
export default createApp({ mosaic: process.env.MOSAIC_URL ? mosaicClient(process.env.MOSAIC_URL) : null });
