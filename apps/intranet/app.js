import express from 'express';
import { mosaicClient } from '@alphacorp/mosaic-client';
import { mailEngine } from '@alphacorp/mail-engine';
import { db } from './models/db.js';
import { seed } from './models/seed.js';
import * as session from './controllers/session.js';
import * as records from './controllers/records.js';
import * as assistant from './controllers/assistant.js';
import * as mail from './controllers/mail.js';
import * as pages from './views/pages.js';

export function createApp({ mosaic = null } = {}) {
  const app = express();
  app.locals.mosaic = mosaic;
  app.locals.mail = mosaic && mailEngine({ db, mosaic });
  app.locals.mail?.seed(seed.mails);
  app.use(express.urlencoded({ extended: false }));
  app.get('/', (req, res) => res.redirect('/correo'));
  app.get('/login', session.loginForm);
  app.post('/login', session.login);
  app.post('/logout', session.logout);
  app.use(session.current);
  app.get('/expedientes', records.index);
  app.get('/expedientes/:id', records.show);
  app.get('/documentos/:id', records.openDocument);
  app.get('/asistente', assistant.index);
  app.post('/asistente', assistant.ask);
  app.get('/correo', mail.inbox);
  app.get('/correo/enviados', mail.sent);
  app.get('/correo/retenidos', mail.held);
  app.get('/correo/borradores', mail.drafts);
  app.get('/correo/redactar', mail.composeForm);
  app.post('/correo', mail.send);
  app.get('/correo/adjuntos/:id', mail.attachment);
  app.get('/correo/:id', mail.show);
  app.post('/correo/entregas/:id/:action', mail.act);
  app.use((err, req, res, next) => {
    console.error(err);
    pages.render(res, 'Error', req.user, pages.message('mosAIc no respondió. No se mostró ni entregó nada.'), 502);
  });
  return app;
}

// Vercel's Express runtime serves this default export; dev.js listens locally.
export default createApp({ mosaic: process.env.MOSAIC_URL ? mosaicClient(process.env.MOSAIC_URL) : null });
