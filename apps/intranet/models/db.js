import { DatabaseSync } from 'node:sqlite';
import { seed } from './seed.js';

// shortcut: in-memory SQLite reseeded on every cold start (Vercel's filesystem is read-only); move to Turso/libSQL if writes must persist.
export const db = new DatabaseSync(':memory:');

db.exec(`
  CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, area TEXT NOT NULL);
  CREATE TABLE records (id TEXT PRIMARY KEY, code TEXT NOT NULL, title TEXT NOT NULL, deadline TEXT NOT NULL);
  CREATE TABLE documents (
    id TEXT PRIMARY KEY, record_id TEXT NOT NULL REFERENCES records(id), title TEXT NOT NULL, body TEXT NOT NULL,
    origin TEXT NOT NULL, resource TEXT, roles TEXT NOT NULL, facts TEXT NOT NULL
  );
  CREATE TABLE reads (user_id TEXT NOT NULL, document_id TEXT NOT NULL, at TEXT NOT NULL);
`);
db.exec(seed.sql);
