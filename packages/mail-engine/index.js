import { randomUUID } from 'node:crypto';

// Limits mirror mosAIc's /v1/messages (PR #6); the 4 MB total keeps a whole email under Vercel's ~4.5 MB body cap.
export const LIMITS = {
  files: 4,
  totalBytes: 4_000_000,
  draft: 4000,
  subject: 150,
  types: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'],
};

// Recipients only see these; held and error deliveries stay with the sender and the reviewer.
const DELIVERED = ['delivered', 'repaired', 'released'];
// Reason stored on seeded deliveries, which never went through mosAIc.
export const SEEDED = 'seed';
export const REPAIRED_SUBJECT = 'Mensaje reparado por mosAIc';

// The subject can leak as much as the body, so mosAIc reviews both as one draft.
const draftOf = ({ subject, body }) => `Asunto: ${subject}\n\n${body}`;

// A repair returns one text; recover the subject when mosAIc kept the prefix, otherwise use a neutral one.
export function splitDraft(text) {
  const m = /^Asunto: ([^\n]*)\n\n([\s\S]*)$/.exec(text);
  return m && m[1].trim() && m[2].trim() ? { subject: m[1].trim(), text: m[2] } : { subject: REPAIRED_SUBJECT, text };
}

// Returns an error message, or null when the email can go to mosAIc.
export function invalid(email) {
  const { subject, body, to, attachments } = email;
  if (!subject.trim() || subject.length > LIMITS.subject) return `El asunto debe tener entre 1 y ${LIMITS.subject} caracteres.`;
  if (!body.trim() || draftOf(email).length > LIMITS.draft) return `El texto debe tener entre 1 y ${LIMITS.draft} caracteres contando el asunto.`;
  if (!to.length) return 'Elige al menos un destinatario.';
  if (attachments.length > LIMITS.files) return `Máximo ${LIMITS.files} adjuntos.`;
  const bad = attachments.find((a) => !LIMITS.types.includes(a.media_type) || !a.name || a.name.length > 200);
  if (bad) return `Tipo de adjunto no permitido: ${bad.name}.`;
  if (attachments.reduce((n, a) => n + a.data.length, 0) > LIMITS.totalBytes) return 'Los adjuntos superan 4 MB en total.';
  return null;
}

const now = () => new Date().toISOString();
const day = () => now().slice(0, 10);

// Mock mail engine: every delivery passes through mosAIc's gate before a recipient can see it.
export function mailEngine({ db, mosaic }) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS mails (
      id TEXT PRIMARY KEY, sender TEXT NOT NULL, task TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY, mail_id TEXT NOT NULL REFERENCES mails(id), name TEXT NOT NULL, media_type TEXT NOT NULL, data BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY, mail_id TEXT NOT NULL REFERENCES mails(id), recipient TEXT NOT NULL,
      status TEXT NOT NULL, subject TEXT, text TEXT, reason TEXT, read_at TEXT);
  `);
  const q = {
    mail: db.prepare('SELECT * FROM mails WHERE id = ?'),
    files: db.prepare('SELECT id, name, media_type, data FROM attachments WHERE mail_id = ? ORDER BY rowid'),
    file: db.prepare('SELECT * FROM attachments WHERE id = ?'),
    deliveries: db.prepare('SELECT * FROM deliveries WHERE mail_id = ? ORDER BY rowid'),
    delivery: db.prepare('SELECT * FROM deliveries WHERE id = ?'),
    set: db.prepare('UPDATE deliveries SET status = ?, subject = ?, text = ?, reason = ? WHERE id = ?'),
  };

  // One decision per recipient; the request_id is stable so a retry is idempotent in mosAIc.
  async function gate(d) {
    const mail = q.mail.get(d.mail_id);
    const files = q.files.all(mail.id);
    const item = { user: d.recipient, task: mail.task, draft: draftOf(mail), request_id: d.id, day: day() };
    // Only send the field when needed: a mosAIc without attachment support rejects it with 422.
    if (files.length) item.attachments = files.map((f) => ({ name: f.name, media_type: f.media_type, data: Buffer.from(f.data).toString('base64') }));
    try {
      const { action, text } = await mosaic.message(item);
      if (action === 'allow') q.set.run('delivered', null, mail.body, null, d.id);
      // A rewritten text no longer matches its files, so a repair with attachments is held.
      else if (action === 'repair' && text && !files.length) {
        const repaired = splitDraft(text);
        q.set.run('repaired', repaired.subject, repaired.text, null, d.id);
      } else q.set.run('held', null, null, action, d.id);
    } catch (err) {
      q.set.run('error', null, null, err.message, d.id);
    }
  }

  const withDetails = (mail) => mail && { ...mail, deliveries: q.deliveries.all(mail.id),
    attachments: q.files.all(mail.id).map(({ data, ...meta }) => ({ ...meta, size: data.length })) };

  return {
    async send({ sender, to, task, subject, body, attachments }) {
      const id = randomUUID();
      db.prepare('INSERT INTO mails VALUES (?, ?, ?, ?, ?, ?)').run(id, sender, task, subject, body, now());
      for (const a of attachments) db.prepare('INSERT INTO attachments VALUES (?, ?, ?, ?, ?)').run(randomUUID(), id, a.name, a.media_type, a.data);
      for (const recipient of new Set(to)) {
        const d = { id: `${id}:${recipient}`, mail_id: id, recipient };
        db.prepare("INSERT INTO deliveries (id, mail_id, recipient, status) VALUES (?, ?, ?, 'pending')").run(d.id, id, recipient);
        await gate(d);
      }
      return id;
    },

    // Demo mail that predates mosAIc: delivered as-is and labelled so nobody mistakes it for an approval. Idempotent by id.
    seed(mails) {
      for (const m of mails) {
        db.prepare('INSERT OR IGNORE INTO mails VALUES (?, ?, ?, ?, ?, ?)').run(m.id, m.sender, m.task, m.subject, m.body, m.at);
        for (const r of m.to) {
          db.prepare("INSERT OR IGNORE INTO deliveries (id, mail_id, recipient, status, text, reason) VALUES (?, ?, ?, 'delivered', ?, ?)")
            .run(`${m.id}:${r}`, m.id, r, m.body, SEEDED);
        }
      }
    },

    // Only the sender retries, and only deliveries mosAIc never answered.
    async retry(sender, deliveryId) {
      const d = q.delivery.get(deliveryId);
      if (!d || d.status !== 'error' || q.mail.get(d.mail_id).sender !== sender) return false;
      await gate(d);
      return true;
    },

    // A human releases a held email; mosAIc learns what the recipient now knows before it is delivered.
    async release(deliveryId) {
      const d = q.delivery.get(deliveryId);
      if (!d || d.status !== 'held') return false;
      const mail = q.mail.get(d.mail_id);
      // shortcut: /v1/sources takes text only, so released attachments are not observed; send transcripts when mosAIc accepts them there.
      await mosaic.source({ origin: `mail_${d.mail_id.replaceAll('-', '')}_${d.recipient}`, at: day(), text: draftOf(mail), recipients: [d.recipient], accept: true });
      q.set.run('released', null, mail.body, null, d.id);
      return true;
    },

    discard(deliveryId) {
      const d = q.delivery.get(deliveryId);
      if (!d || d.status !== 'held') return false;
      q.set.run('discarded', null, null, d.reason, d.id);
      return true;
    },

    markRead(user, mailId) {
      db.prepare('UPDATE deliveries SET read_at = ? WHERE mail_id = ? AND recipient = ? AND read_at IS NULL').run(now(), mailId, user);
    },

    inbox: (user) => db.prepare(`
      SELECT m.id, m.sender, m.task, m.at, d.status, d.read_at, COALESCE(d.subject, m.subject) AS subject, d.text,
        CASE WHEN d.status = 'repaired' THEN 0 ELSE (SELECT COUNT(*) FROM attachments a WHERE a.mail_id = m.id) END AS files
      FROM deliveries d JOIN mails m ON m.id = d.mail_id
      WHERE d.recipient = ? AND d.status IN (${DELIVERED.map(() => '?')}) ORDER BY m.at DESC`).all(user, ...DELIVERED),
    unread: (user) => db.prepare(`SELECT COUNT(*) AS n FROM deliveries WHERE recipient = ? AND read_at IS NULL
      AND status IN (${DELIVERED.map(() => '?')})`).get(user, ...DELIVERED).n,
    sent: (user) => db.prepare('SELECT * FROM mails WHERE sender = ? ORDER BY at DESC').all(user).map(withDetails),
    held: () => db.prepare(`SELECT * FROM mails WHERE id IN (SELECT mail_id FROM deliveries WHERE status = 'held') ORDER BY at DESC`)
      .all().map(withDetails),

    // What a user may see of an email: the sender and the reviewer see the original; a recipient sees what mosAIc let through.
    view(user, mailId, { reviewer = false } = {}) {
      const mail = withDetails(q.mail.get(mailId));
      if (!mail) return undefined;
      if (mail.sender === user || (reviewer && mail.deliveries.some((d) => d.status === 'held'))) return { ...mail, text: mail.body };
      const mine = mail.deliveries.find((d) => d.recipient === user && DELIVERED.includes(d.status));
      if (!mine) return undefined;
      return { id: mail.id, sender: mail.sender, task: mail.task, at: mail.at, subject: mine.subject ?? mail.subject, text: mine.text,
        to: mail.deliveries.map((d) => d.recipient), attachments: mine.status === 'repaired' ? [] : mail.attachments };
    },

    attachment(user, id, opts) {
      const file = q.file.get(id);
      return file && this.view(user, file.mail_id, opts)?.attachments.some((a) => a.id === id) ? file : undefined;
    },
  };
}
