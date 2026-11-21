import express from 'express';
import * as session from './controllers/session.js';
import * as records from './controllers/records.js';

export function createApp() {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.get('/', (req, res) => res.redirect('/expedientes'));
  app.get('/login', session.loginForm);
  app.post('/login', session.login);
  app.post('/logout', session.logout);
  app.use(session.current);
  app.get('/expedientes', records.index);
  app.get('/expedientes/:id', records.show);
  app.get('/documentos/:id', records.openDocument);
  return app;
}

// Vercel's Express runtime serves this default export; dev.js listens locally.
export default createApp();
