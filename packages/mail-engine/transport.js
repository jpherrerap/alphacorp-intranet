const RESEND = 'https://api.resend.com/emails';
const LABEL = { delivered: 'aprobado por mosAIc', repaired: 'reparado por mosAIc', released: 'liberado por Legal' };

// Picks how mosAIc-approved mail leaves the intranet: 'mock' (default) keeps it in-app; 'resend' also copies it to one real mailbox.
export function transportFrom(env, fetchImpl = fetch) {
  const kind = env.MAIL_TRANSPORT || 'mock';
  if (kind === 'mock') return undefined;
  if (kind !== 'resend') throw new Error(`MAIL_TRANSPORT desconocido: ${kind}. Usa mock o resend.`);
  const { RESEND_API_KEY: key, MAIL_TO: to, MAIL_FROM: from = 'AlphaCorp Mail <onboarding@resend.dev>' } = env;
  if (!key) throw new Error('MAIL_TRANSPORT=resend requiere RESEND_API_KEY.');
  // Exactly one address: without a verified domain Resend only delivers to the account owner, and it keeps real people out of the demo.
  if (!/^[^\s@,;]+@[^\s@,;]+$/.test(to ?? '')) throw new Error('MAIL_TRANSPORT=resend requiere MAIL_TO con una sola dirección.');

  return async ({ id, recipient, status, subject, text, files }) => {
    const res = await fetchImpl(RESEND, {
      method: 'POST',
      // A retried copy of the same delivery is sent once.
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': id },
      body: JSON.stringify({
        from, to: [to], subject: `[${recipient}] ${subject}`,
        text: `${text}\n\n— Para ${recipient}@alphacorp.cl · ${LABEL[status] ?? status}`,
        headers: { 'X-Mosaic-Status': status },
        attachments: files.map((f) => ({ filename: f.name, content: Buffer.from(f.data).toString('base64') })),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend respondió ${res.status}: ${await res.text()}`);
  };
}
