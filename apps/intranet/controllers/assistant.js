import { randomUUID } from 'node:crypto';
import { seed } from '../models/seed.js';
import * as pages from '../views/pages.js';
import { today } from './records.js';

export const TASKS = seed.tasks;

const disabled = (req, res) =>
  pages.render(res, 'Asistente', req.user, pages.message('Configura MOSAIC_URL para usar el asistente.'), 503);

export async function index(req, res) {
  const { mosaic } = req.app.locals;
  if (!mosaic) return disabled(req, res);
  const { messages } = await mosaic.inbox(req.user.id);
  pages.render(res, 'Asistente', req.user, pages.assistant(TASKS, messages, req.query.estado));
}

// The draft goes only to mosAIc; the user sees whatever reaches their inbox.
export async function ask(req, res) {
  const { mosaic } = req.app.locals;
  if (!mosaic) return disabled(req, res);
  const id = req.body?.task;
  if (!Object.hasOwn(TASKS, id)) return pages.render(res, 'Asistente', req.user, pages.message('Pregunta desconocida.'), 400);
  const { task = id, draft, attachments = [] } = TASKS[id];
  const { action } = await mosaic.message({ user: req.user.id, task, draft, attachments, request_id: randomUUID(), day: today() });
  res.redirect(`/asistente?estado=${encodeURIComponent(action)}`);
}
