import { db } from './db.js';

const canRead = (user, doc) => doc.roles.split(',').includes(user.role);

export const users = {
  all: () => db.prepare('SELECT * FROM users ORDER BY name').all(),
  find: (id) => (id ? db.prepare('SELECT * FROM users WHERE id = ?').get(id) : undefined),
};

export const records = {
  all: () => db.prepare('SELECT * FROM records ORDER BY code').all(),
  find: (id) => db.prepare('SELECT * FROM records WHERE id = ?').get(id),
};

export const documents = {
  visible: (user, recordId) =>
    db.prepare('SELECT * FROM documents WHERE record_id = ? ORDER BY title').all(recordId).filter((d) => canRead(user, d)),
  // Returns undefined when the document does not exist or the role cannot read it.
  open: (user, id) => {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
    return doc && canRead(user, doc) ? { ...doc, facts: JSON.parse(doc.facts) } : undefined;
  },
  markRead: (user, doc, at) => db.prepare('INSERT INTO reads VALUES (?, ?, ?)').run(user.id, doc.id, at),
};
