import { randomUUID } from 'node:crypto';
import * as pages from '../views/pages.js';
import { today } from './records.js';

// The company's agent. Drafts reuse the clauses of mosAIc's case; text mosAIc cannot map goes to review.
export const TASKS = {
  due: { question: '¿Cuándo vence el trámite de O-17?', draft: 'El trámite vence el viernes. El expediente O-17 corresponde a BetaAI.' },
  signature: { question: '¿Está firmada la oferta para BetaAI?', draft: 'La oferta para BetaAI está firmada.' },
  record: { question: '¿En qué estado está el expediente O-17?', draft: 'El expediente O-17 ya está firmado.' },
};

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
  const { action } = await mosaic.message({
    user: req.user.id, task: id, draft: TASKS[id].draft, request_id: randomUUID(), day: today(),
  });
  res.redirect(`/asistente?estado=${encodeURIComponent(action)}`);
}
