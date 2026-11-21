import { DatabaseSync } from 'node:sqlite';

// shortcut: in-memory SQLite reseeded on every cold start (Vercel's filesystem is read-only); move to Turso/libSQL if writes must persist.
export const db = new DatabaseSync(':memory:');

// Mirrors mosAIc's example case (alphacorp/atlas) so the guard runs with its default policy and directory.
db.exec(`
  CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, area TEXT NOT NULL);
  CREATE TABLE records (id TEXT PRIMARY KEY, code TEXT NOT NULL, title TEXT NOT NULL, deadline TEXT NOT NULL);
  CREATE TABLE documents (
    id TEXT PRIMARY KEY, record_id TEXT NOT NULL REFERENCES records(id), title TEXT NOT NULL, body TEXT NOT NULL,
    origin TEXT NOT NULL, resource TEXT, roles TEXT NOT NULL, facts TEXT NOT NULL
  );
  CREATE TABLE reads (user_id TEXT NOT NULL, document_id TEXT NOT NULL, at TEXT NOT NULL);

  INSERT INTO users VALUES
    ('ana', 'Ana Rojas', 'vendor', 'Ventas'),
    ('luis', 'Luis Pérez', 'vendor', 'Ventas'),
    ('sofia', 'Sofía Mena', 'senior_legal', 'Legal'),
    ('ines', 'Inés Soto', 'procurement', 'Compras');

  INSERT INTO records VALUES ('o17', 'O-17', 'Oferta de servicios gestionados', 'viernes');

  INSERT INTO documents VALUES
    ('calendario_o17', 'o17', 'Calendario de trámites', 'El trámite vence el viernes.',
     'calendar_o17', NULL, 'vendor,procurement,legal,senior_legal', '[["o17","deadline","friday"]]'),
    ('acta_o17', 'o17', 'Acta de firma', 'El expediente O-17 ya está firmado.',
     'record_o17', 'signature_record', 'procurement,legal,senior_legal', '[["o17","signature","signed"]]');
`);
