import { randomUUID } from 'node:crypto';

// Limits mirror mosAIc's /v1/messages (PR #6); the 4 MB total keeps a whole email under Vercel's ~4.5 MB body cap.
export const LIMITS = {
  files: 4,
  totalBytes: 4_000_000,
  draft: 4000,
  types: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'],
};

// Recipients only see these; held and error deliveries stay with the sender and the reviewer.
const DELIVERED = ['delivered', 'repaired', 'released'];

// Returns an error message, or null when the email can go to mosAIc.
export function invalid({ body, to, attachments }) {
  if (!body.trim() || body.length > LIMITS.draft) return `El texto debe tener entre 1 y ${LIMITS.draft} caracteres.`;
  if (!to.length) return 'Elige al menos un destinatario.';
  if (attachments.length > LIMITS.files) return `Máximo ${LIMITS.files} adjuntos.`;
  const bad = attachments.find((a) => !LIMITS.types.includes(a.media_type) || !a.name || a.name.length > 200);
  if (bad) return `Tipo de adjunto no permitido: ${bad.name}.`;
  if (attachments.reduce((n, a) => n + a.data.length, 0) > LIMITS.totalBytes) return 'Los adjuntos superan 4 MB en total.';
  return null;
}

const today = () => new Date().toISOString().slice(0, 10);

// Mock mail engine: every delivery passes through mosAIc's gate before a recipient can see it.
export function mailEngine({ db, mosaic }) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS mails (id TEXT PRIMARY KEY, sender TEXT NOT NULL, task TEXT NOT NULL, body TEXT NOT NULL, at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY, mail_id TEXT NOT NULL REFERENCES mails(id), name TEXT NOT NULL, media_type TEXT NOT NULL, data BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY, mail_id TEXT NOT NULL REFERENCES mails(id), recipient TEXT NOT NULL,
      status TEXT NOT NULL, text TEXT, reason TEXT);
  `);
  const q = {
    mail: db.prepare('SELECT * FROM mails WHERE id = ?'),
    files: db.prepare('SELECT id, name, media_type, data FROM attachments WHERE mail_id = ? ORDER BY rowid'),
    file: db.prepare('SELECT * FROM attachments WHERE id = ?'),
    deliveries: db.prepare('SELECT * FROM deliveries WHERE mail_id = ? ORDER BY rowid'),
    delivery: db.prepare('SELECT * FROM deliveries WHERE id = ?'),
    set: db.prepare('UPDATE deliveries SET status = ?, text = ?, reason = ? WHERE id = ?'),
  };

  // One decision per recipient; the request_id is stable so a retry is idempotent in mosAIc.
  async function gate(d) {
    const mail = q.mail.get(d.mail_id);
    const files = q.files.all(mail.id);
    const item = { user: d.recipient, task: mail.task, draft: mail.body, request_id: d.id, day: today() };
    // Only send the field when needed: a mosAIc without attachment support rejects it with 422.
    if (files.length) item.attachments = files.map((f) => ({ name: f.name, media_type: f.media_type, data: Buffer.from(f.data).toString('base64') }));
    try {
      const { action, text } = await mosaic.message(item);
      if (action === 'allow') q.set.run('delivered', mail.body, null, d.id);
      // A rewritten text no longer matches its files, so a repair with attachments is held.
      else if (action === 'repair' && text && !files.length) q.set.run('repaired', text, null, d.id);
      else q.set.run('held', null, action, d.id);
    } catch (err) {
      q.set.run('error', null, err.message, d.id);
    }
  }

  const withDetails = (mail) => mail && { ...mail, deliveries: q.deliveries.all(mail.id),
    attachments: q.files.all(mail.id).map(({ data, ...meta }) => ({ ...meta, size: data.length })) };

  return {
    async send({ sender, to, task, body, attachments }) {
      const id = randomUUID();
      db.prepare('INSERT INTO mails VALUES (?, ?, ?, ?, ?)').run(id, sender, task, body, today());
      for (const a of attachments) db.prepare('INSERT INTO attachments VALUES (?, ?, ?, ?, ?)').run(randomUUID(), id, a.name, a.media_type, a.data);
      for (const recipient of new Set(to)) {
        const d = { id: `${id}:${recipient}`, mail_id: id, recipient };
        db.prepare("INSERT INTO deliveries VALUES (?, ?, ?, 'pending', NULL, NULL)").run(d.id, id, recipient);
        await gate(d);
      }
      return id;
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
      await mosaic.source({ origin: `mail_${d.mail_id.replaceAll('-', '')}_${d.recipient}`, at: today(), text: mail.body, recipients: [d.recipient], accept: true });
      q.set.run('released', mail.body, null, d.id);
      return true;
    },

    discard(deliveryId) {
      const d = q.delivery.get(deliveryId);
      if (!d || d.status !== 'held') return false;
      q.set.run('discarded', null, d.reason, d.id);
      return true;
    },

    inbox: (user) => db.prepare(`SELECT m.id, m.sender, m.task, m.at, d.status FROM deliveries d JOIN mails m ON m.id = d.mail_id
      WHERE d.recipient = ? AND d.status IN (${DELIVERED.map(() => '?')}) ORDER BY d.rowid DESC`).all(user, ...DELIVERED),
    sent: (user) => db.prepare('SELECT * FROM mails WHERE sender = ? ORDER BY rowid DESC').all(user).map(withDetails),
    held: () => db.prepare("SELECT DISTINCT mail_id FROM deliveries WHERE status = 'held' ORDER BY rowid DESC").all()
      .map((r) => withDetails(q.mail.get(r.mail_id))),

    // What a user may see of an email: the sender and the reviewer see the original; a recipient sees what mosAIc let through.
    view(user, mailId, { reviewer = false } = {}) {
      const mail = withDetails(q.mail.get(mailId));
      if (!mail) return undefined;
      if (mail.sender === user || (reviewer && mail.deliveries.some((d) => d.status === 'held'))) return { ...mail, text: mail.body };
      const mine = mail.deliveries.find((d) => d.recipient === user && DELIVERED.includes(d.status));
      if (!mine) return undefined;
      return { id: mail.id, sender: mail.sender, task: mail.task, at: mail.at, text: mine.text,
        attachments: mine.status === 'repaired' ? [] : mail.attachments };
    },

    attachment(user, id, opts) {
      const file = q.file.get(id);
      return file && this.view(user, file.mail_id, opts)?.attachments.some((a) => a.id === id) ? file : undefined;
    },
  };
}
