import { documents, records } from '../models/index.js';
import * as pages from '../views/pages.js';

export const today = () => new Date().toISOString().slice(0, 10);

export const index = (req, res) => pages.render(res, 'Expedientes', req.user, pages.records(records.all()));

export function show(req, res) {
  const record = records.find(req.params.id);
  if (!record) return pages.render(res, 'No encontrado', req.user, pages.message('El expediente no existe.'), 404);
  pages.render(res, `Expediente ${record.code}`, req.user, pages.record(record, documents.visible(req.user, record.id)));
}

export async function openDocument(req, res) {
  const doc = documents.open(req.user, req.params.id);
  if (!doc) return pages.render(res, 'No disponible', req.user, pages.message('No existe o tu rol no puede leerlo.'), 404);
  const at = today();
  // Evidence reaches mosAIc before the user sees the text; otherwise later answers underestimate what they know.
  await req.app.locals.mosaic?.observe([
    { origin: doc.origin, user: req.user.id, grade: 'read', resource: doc.resource, at, facts: doc.facts },
  ]);
  documents.markRead(req.user, doc, at);
  pages.render(res, doc.title, req.user, pages.document(doc));
}
