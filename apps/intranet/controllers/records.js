import { documents, records } from '../models/index.js';
import * as pages from '../views/pages.js';

export const today = () => new Date().toISOString().slice(0, 10);

export const index = (req, res) => pages.render(res, 'Expedientes', req.user, pages.records(records.all()));

export function show(req, res) {
  const record = records.find(req.params.id);
  if (!record) return pages.render(res, 'No encontrado', req.user, pages.message('El expediente no existe.'), 404);
  pages.render(res, `Expediente ${record.code}`, req.user, pages.record(record, documents.visible(req.user, record.id)));
}

export function openDocument(req, res) {
  const doc = documents.open(req.user, req.params.id);
  if (!doc) return pages.render(res, 'No disponible', req.user, pages.message('No existe o tu rol no puede leerlo.'), 404);
  documents.markRead(req.user, doc, today());
  pages.render(res, doc.title, req.user, pages.document(doc));
}
