import { SEEDED } from '@alphacorp/mail-engine';
import { html, Raw } from './html.js';

const STYLE = new Raw(`
  :root {
    --bg: #eef1f4; --surface: #ffffff; --fg: #17212b; --muted: #5b6876; --line: #d8dee5; --hover: #f4f7f9;
    --accent: #0f5e6e; --accent-fg: #ffffff; --accent-soft: #e1eff2;
    --ok: #1b7a46; --wait: #9a6400; --fail: #b4372c; --info: #2f5fa8;
    color-scheme: light; font: 15px/1.5 "Segoe UI", system-ui, -apple-system, sans-serif;
  }
  @media (prefers-color-scheme: dark) { :root {
    --bg: #0f1418; --surface: #171e24; --fg: #e3e9ee; --muted: #93a1ad; --line: #27323b; --hover: #1d262d;
    --accent: #5bb8c9; --accent-fg: #0b1a1e; --accent-soft: #16343b;
    --ok: #5ccf8c; --wait: #f0b44a; --fail: #f07c6e; --info: #8fb2f0; color-scheme: dark;
  } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg); }
  a { color: var(--accent); }
  h1 { font-size: 1.35rem; margin: 0 0 1rem; }
  h2 { font-size: 1rem; margin: 1.5rem 0 .6rem; }
  button, input, select, textarea { font: inherit; color: inherit; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  .top { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem 1.5rem; padding: .55rem 1.25rem;
         background: var(--surface); border-bottom: 1px solid var(--line); }
  .brand { display: flex; align-items: center; gap: .5rem; font-weight: 600; color: var(--fg); text-decoration: none; }
  .logo { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; border-radius: .35rem;
          background: var(--accent); color: var(--accent-fg); font-weight: 700; }
  .apps { display: flex; gap: .25rem; flex: 1; flex-wrap: wrap; }
  .apps a { padding: .4rem .75rem; border-radius: .35rem; color: var(--muted); text-decoration: none; font-weight: 500; }
  .apps a:hover { background: var(--hover); color: var(--fg); }
  .apps a[aria-current="page"] { background: var(--accent-soft); color: var(--accent); }
  .me { display: flex; align-items: center; gap: .6rem; }
  .me small { display: block; color: var(--muted); font-size: .78rem; line-height: 1.2; }
  .avatar { display: inline-grid; place-items: center; flex: none; width: 2.1rem; height: 2.1rem; border-radius: 50%;
            background: var(--accent-soft); color: var(--accent); font-weight: 600; font-size: .8rem; }
  .page { max-width: 72rem; margin: 0 auto; padding: 1.5rem 1.25rem 3rem; }
  .card { background: var(--surface); border: 1px solid var(--line); border-radius: .5rem; padding: 1.1rem 1.25rem; }
  .muted { color: var(--muted); }
  .notice { padding: .65rem .9rem; border: 1px solid var(--line); border-left: 3px solid var(--wait); border-radius: .35rem; background: var(--surface); }
  .btn { display: inline-flex; align-items: center; gap: .4rem; padding: .45rem .9rem; border-radius: .35rem; cursor: pointer;
         border: 1px solid var(--line); background: var(--surface); text-decoration: none; color: var(--fg); font-weight: 500; }
  .btn:hover { background: var(--hover); }
  .btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); }
  form.inline { display: inline; }
  .list { list-style: none; margin: 0; padding: 0; }
  .list > li { padding: .7rem 0; border-top: 1px solid var(--line); }
  .list > li:first-child { border-top: 0; }

  .mail { display: grid; grid-template-columns: 13rem minmax(0, 1fr); gap: 1.25rem; align-items: start; }
  .folders { display: grid; gap: .75rem; position: sticky; top: 1rem; }
  .folders nav { display: grid; gap: .15rem; }
  .folders nav a { display: flex; justify-content: space-between; padding: .45rem .7rem; border-radius: .35rem; color: var(--fg); text-decoration: none; }
  .folders nav a:hover { background: var(--hover); }
  .folders nav a[aria-current="page"] { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
  .count { font-size: .8rem; font-weight: 600; min-width: 1.5rem; text-align: center; padding: 0 .4rem; border-radius: 1rem;
           background: var(--accent); color: var(--accent-fg); }
  .pane { background: var(--surface); border: 1px solid var(--line); border-radius: .5rem; min-width: 0; }
  .pane > header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--line); }
  .pane > header h1 { margin: 0; }
  .pane-body { padding: 1rem 1.25rem; }
  @media (max-width: 760px) {
    .mail { grid-template-columns: minmax(0, 1fr); }
    .folders { position: static; grid-template-columns: auto 1fr; align-items: center; }
    .folders nav { display: flex; flex-wrap: wrap; }
    .me .me-name { display: none; }
  }

  .rows { list-style: none; margin: 0; padding: 0; }
  .rows a { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .8rem; padding: .8rem 1.25rem;
            border-top: 1px solid var(--line); color: inherit; text-decoration: none; }
  .rows li:first-child a { border-top: 0; }
  .rows a:hover { background: var(--hover); }
  .row-top { display: flex; justify-content: space-between; gap: 1rem; }
  .row-top time { color: var(--muted); font-size: .85rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .who, .subject, .preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .preview { color: var(--muted); font-size: .9rem; }
  .unread .who, .unread .subject { font-weight: 700; }
  .unread .avatar { background: var(--accent); color: var(--accent-fg); }
  .clip { width: .95rem; height: .95rem; vertical-align: -.15rem; color: var(--muted); }
  .chips { display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .35rem; }
  .chip { display: inline-flex; align-items: center; gap: .35rem; font-size: .78rem; padding: .1rem .5rem; border-radius: 1rem;
          border: 1px solid var(--line); color: var(--fg); white-space: nowrap; }
  .chip::before { content: ""; width: .5rem; height: .5rem; border-radius: 50%; background: currentColor; }
  .chip.ok::before { background: var(--ok); } .chip.wait::before { background: var(--wait); }
  .chip.fail::before { background: var(--fail); } .chip.info::before { background: var(--info); }
  .tag { font-size: .75rem; padding: .05rem .45rem; border-radius: .25rem; background: var(--accent-soft); color: var(--accent); font-weight: 600; }
  .empty { padding: 2.5rem 1.25rem; text-align: center; color: var(--muted); }

  .meta { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: .2rem .8rem; align-items: center; }
  .meta .avatar { grid-row: span 2; width: 2.6rem; height: 2.6rem; }
  .meta time { color: var(--muted); font-size: .85rem; }
  .addr { color: var(--muted); font-size: .9rem; }
  .msg-body { white-space: pre-wrap; margin: 1.25rem 0; max-width: 70ch; }
  .files { display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: .75rem; }
  .file { border: 1px solid var(--line); border-radius: .4rem; padding: .6rem; display: grid; gap: .4rem; min-width: 0; }
  .file img { width: 100%; border-radius: .25rem; display: block; }
  .file audio { width: 100%; }
  .file-name { font-size: .85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .table-wrap { overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; font-size: .92rem; }
  th, td { text-align: left; padding: .55rem .6rem; border-top: 1px solid var(--line); vertical-align: middle; }
  th { color: var(--muted); font-weight: 600; font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; border-top: 0; }
  .reason { display: block; color: var(--muted); font-size: .8rem; }

  .compose { display: grid; gap: .9rem; }
  .field { display: grid; grid-template-columns: 7rem minmax(0, 1fr); gap: .6rem; align-items: center; }
  .field > span { color: var(--muted); font-size: .9rem; }
  .field input[type=text], .field select, textarea { width: 100%; padding: .5rem .6rem; border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); }
  textarea { min-height: 12rem; resize: vertical; }
  .pills { display: flex; flex-wrap: wrap; gap: .4rem; }
  .pill { display: inline-flex; align-items: center; gap: .4rem; padding: .25rem .65rem .25rem .3rem; border: 1px solid var(--line); border-radius: 2rem; cursor: pointer; }
  .pill .avatar { width: 1.6rem; height: 1.6rem; font-size: .7rem; }
  .pill:has(input:checked) { border-color: var(--accent); background: var(--accent-soft); }
  .pill input { margin: 0; }
  .compose footer { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
  @media (max-width: 560px) { .field { grid-template-columns: minmax(0, 1fr); } }

  .login { max-width: 24rem; margin: 4rem auto; display: grid; gap: 1rem; }
  .login label { display: grid; gap: .35rem; }
  .login select { padding: .5rem; border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); }
  .ask { display: grid; gap: .5rem; }
  .ask .btn { width: 100%; justify-content: flex-start; }
  .grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1.25rem; align-items: start; }
`);

const APPS = [['expedientes', 'Expedientes'], ['asistente', 'Asistente'], ['correo', 'Correo']];
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');
const avatar = (user) => html`<span class="avatar" aria-hidden="true">${user ? initials(user.name) : '?'}</span>`;

// Pages that bring their own heading (the mailbox) mark themselves as full so the layout skips its h1.
const full = (raw) => Object.assign(raw, { full: true });

export const layout = (title, user, body, path = '') => html`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · AlphaCorp</title><style>${STYLE}</style></head>
<body><header class="top"><a class="brand" href="/"><span class="logo">A</span>AlphaCorp</a>${user && html`
  <nav class="apps">${APPS.map(([id, label]) => html`<a href="/${id}" ${new Raw(path.split('/')[1] === id ? 'aria-current="page"' : '')}>${label}</a>`)}</nav>
  <div class="me">${avatar(user)}<span class="me-name">${user.name}<small>${user.area}</small></span>
    <form class="inline" method="post" action="/logout"><button class="btn">Salir</button></form></div>`}</header>
<main class="page">${!body.full && html`<h1>${title}</h1>`}${body}</main></body></html>`;

export const render = (res, title, user, body, status = 200) => res.status(status).send(layout(title, user, body, res.req.path).s);

export const login = (users) => html`<form class="card login" method="post" action="/login">
  <strong>Ingresar a la intranet</strong>
  <label>Usuario <select name="user">${users.map((u) => html`<option value="${u.id}">${u.name} · ${u.area}</option>`)}</select></label>
  <button class="btn primary">Ingresar</button>
  <p class="muted">Datos ficticios. El usuario elegido define el rol que ve mosAIc.</p></form>`;

export const records = (list) => html`<div class="card"><ul class="list">${list.map((r) => html`<li>
  <a href="/expedientes/${r.id}"><strong>${r.code}</strong></a> · ${r.title} <span class="muted">· vence el ${r.deadline}</span></li>`)}</ul></div>`;

export const record = (r, docs) => html`<div class="card"><p>${r.title}. Vence el ${r.deadline}.</p>
  <h2>Documentos</h2>
  ${docs.length ? html`<ul class="list">${docs.map((d) => html`<li><a href="/documentos/${d.id}">${d.title}</a></li>`)}</ul>`
                : html`<p class="muted">Tu rol no tiene documentos de este expediente.</p>`}</div>`;

export const document = (d) => html`<div class="card"><p>${d.body}</p><p><a href="/expedientes/${d.record_id}">Volver al expediente</a></p></div>`;

export const message = (text) => html`<p class="notice">${text}</p>`;

const OUTCOMES = {
  allow: 'La respuesta llegó completa a tu bandeja.',
  repair: 'mosAIc entregó una versión reparada de la respuesta.',
  review: 'La respuesta quedó en revisión humana y no llegó a tu bandeja.',
};

export const assistant = (tasks, inbox, outcome) => html`
  ${Object.hasOwn(OUTCOMES, outcome) && message(OUTCOMES[outcome])}
  <div class="grid2">
    <section class="card"><h2 style="margin-top:0">Preguntar</h2><div class="ask">${Object.entries(tasks).map(([id, t]) => html`
      <form method="post" action="/asistente"><input type="hidden" name="task" value="${id}"><button class="btn">${t.question}</button></form>`)}</div></section>
    <section class="card"><h2 style="margin-top:0">Bandeja</h2>
      ${inbox.length ? html`<ul class="list">${inbox.map((m) => html`<li>${m.text}</li>`)}</ul>` : html`<p class="muted">Sin mensajes.</p>`}</section>
  </div>`;

// --- Correo ---

const ZONE = 'America/Santiago';
const shortDate = (iso) => {
  const d = new Date(iso);
  const sameDay = d.toLocaleDateString('es-CL', { timeZone: ZONE }) === new Date().toLocaleDateString('es-CL', { timeZone: ZONE });
  return d.toLocaleString('es-CL', sameDay ? { hour: '2-digit', minute: '2-digit', timeZone: ZONE } : { day: 'numeric', month: 'short', timeZone: ZONE });
};
const longDate = (iso) => new Date(iso).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short', timeZone: ZONE });
const address = (id) => `${id}@alphacorp.cl`;
const clip = new Raw('<svg class="clip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="Con adjuntos"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7L14 4.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3L15 7.5"/></svg>');

// Delivery answers "did it reach them"; review answers "who decided and what".
const DELIVERY = {
  delivered: ['ok', 'Entregado'], repaired: ['ok', 'Entregado'], released: ['ok', 'Entregado'],
  pending: ['wait', 'En espera'], held: ['wait', 'En espera'], error: ['fail', 'No entregado'], discarded: ['fail', 'No entregado'],
};
const review = (d) => ({
  delivered: d.reason === SEEDED ? 'Sin revisión · previo a mosAIc' : 'Aprobado por mosAIc',
  repaired: 'Reparado por mosAIc', released: 'Liberado por Legal', pending: 'Consultando a mosAIc',
  held: 'Retenido · en revisión Legal', error: 'mosAIc no respondió', discarded: 'Descartado por Legal',
})[d.status];
const SHORT = { delivered: 'Entregado', repaired: 'Reparado', released: 'Liberado', pending: 'En espera', held: 'Retenido', error: 'No entregado', discarded: 'Descartado' };
const TONE = { repaired: 'info', released: 'info' };
const chip = (d, people) => html`<span class="chip ${TONE[d.status] ?? DELIVERY[d.status][0]}">${people[d.recipient]?.name.split(' ')[0]} · ${SHORT[d.status]}</span>`;

export const mailbox = ({ title, folder, counts, content }) => full(html`<div class="mail">
  <aside class="folders">
    <a class="btn primary" href="/correo/redactar">Redactar</a>
    <nav aria-label="Carpetas">
      <a href="/correo" ${new Raw(folder === 'inbox' ? 'aria-current="page"' : '')}>Recibidos ${counts.inbox > 0 && html`<span class="count">${counts.inbox}</span>`}</a>
      <a href="/correo/enviados" ${new Raw(folder === 'sent' ? 'aria-current="page"' : '')}>Enviados</a>
      ${counts.held !== null && html`<a href="/correo/retenidos" ${new Raw(folder === 'held' ? 'aria-current="page"' : '')}>Retenidos ${counts.held > 0 && html`<span class="count">${counts.held}</span>`}</a>`}
    </nav>
  </aside>
  <section class="pane"><header><h1>${title}</h1></header>${content}</section>
</div>`);

const row = ({ href, person, who, at, subject, files, preview, unread, extra }) => html`<li><a href="${href}" class="${unread ? 'unread' : ''}">
  ${avatar(person)}
  <div style="min-width:0"><div class="row-top"><span class="who">${who}</span><time datetime="${at}">${shortDate(at)}</time></div>
    <div class="subject">${subject} ${files > 0 && clip}</div>
    <div class="preview">${preview}</div>${extra}</div></a></li>`;

export function mailList(kind, list, people, classes) {
  if (!list.length) return html`<p class="empty">No hay correos en esta carpeta.</p>`;
  const rows = list.map((m) => {
    if (kind === 'inbox') {
      const note = m.status === 'repaired' ? 'Reparado por mosAIc' : m.status === 'released' ? 'Liberado por Legal' : null;
      return row({ href: `/correo/${m.id}`, person: people[m.sender], who: people[m.sender]?.name, at: m.at, subject: m.subject,
        files: m.files, preview: m.text, unread: !m.read_at, extra: note && html`<div class="chips"><span class="chip info">${note}</span></div>` });
    }
    const shown = kind === 'held' ? m.deliveries.filter((d) => d.status === 'held') : m.deliveries;
    const who = kind === 'held' ? `De ${people[m.sender]?.name} · para ${shown.map((d) => people[d.recipient]?.name).join(', ')}`
      : `Para: ${m.deliveries.map((d) => people[d.recipient]?.name).join(', ')}`;
    return row({ href: `/correo/${m.id}`, person: people[kind === 'held' ? m.sender : m.deliveries[0]?.recipient], who, at: m.at,
      subject: m.subject, files: m.attachments.length, preview: m.body, extra: html`<div class="chips">${shown.map((d) => chip(d, people))}</div>` });
  });
  return html`<ul class="rows">${rows}</ul>`;
}

const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,application/pdf,audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4';

export const compose = ({ people, classifications, notice, draft }) => html`<form class="pane-body compose" method="post" action="/correo" enctype="multipart/form-data">
  ${notice && message(notice)}
  <div class="field"><span>Para</span><div class="pills">${people.map((u) => html`<label class="pill">
    <input type="checkbox" name="to" value="${u.id}" ${new Raw(draft.to?.includes(u.id) ? 'checked' : '')}>${avatar(u)}${u.name}</label>`)}</div></div>
  <label class="field"><span>Asunto</span><input type="text" id="subject" name="subject" maxlength="150" required value="${draft.subject ?? ''}"></label>
  <label class="field"><span>Clasificación</span><select id="task" name="task" required>
    <option value="">Elige el tema del correo</option>
    ${Object.entries(classifications).map(([id, label]) => html`<option value="${id}" ${new Raw(draft.task === id ? 'selected' : '')}>${label}</option>`)}</select></label>
  <textarea id="body" name="body" maxlength="3900" required aria-label="Texto del correo" placeholder="Escribe tu mensaje">${draft.body ?? ''}</textarea>
  <label class="field"><span>Adjuntos</span><input type="file" id="files" name="files" multiple accept="${ACCEPT}"></label>
  <footer><button class="btn primary">Enviar</button>
    <span class="muted">Imágenes, PDF o audio: hasta 4 archivos y 4 MB. mosAIc revisa el asunto, el texto y los adjuntos para cada destinatario antes de entregar.</span></footer>
</form>`;

const fileView = (a) => {
  const src = `/correo/adjuntos/${a.id}`;
  const size = a.size >= 1e6 ? `${(a.size / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(a.size / 1e3))} KB`;
  const label = html`<div class="file-name">${a.name} <span class="muted">· ${size}</span></div>`;
  if (a.media_type.startsWith('image/')) return html`<div class="file"><a href="${src}"><img src="${src}" alt="${a.name}"></a>${label}</div>`;
  if (a.media_type.startsWith('audio/')) return html`<div class="file"><audio controls src="${src}"></audio>${label}</div>`;
  return html`<div class="file"><a class="btn" href="${src}">Abrir PDF</a>${label}</div>`;
};

const deliveryAction = (d, action, label, primary) => html`<form class="inline" method="post" action="/correo/entregas/${encodeURIComponent(d.id)}/${action}">
  <button class="btn ${primary ? 'primary' : ''}">${label}</button></form>`;

export const mailView = (m, people, classes, user, reviewer) => html`<div class="pane-body">
  <div class="meta">${avatar(people[m.sender])}
    <div><strong>${people[m.sender]?.name}</strong> <span class="addr">&lt;${address(m.sender)}&gt;</span></div>
    <time datetime="${m.at}">${longDate(m.at)}</time>
    <div class="addr">Para: ${(m.to ?? m.deliveries.map((d) => d.recipient)).map((id) => people[id]?.name).join(', ')}</div>
    <div>${classes[m.task] ? html`<span class="tag">${classes[m.task]}</span>` : html`<span class="tag">General</span>`}</div>
  </div>
  <div class="msg-body">${m.text}</div>
  ${m.attachments.length > 0 && html`<div class="files">${m.attachments.map(fileView)}</div>`}
  ${m.deliveries && html`<h2>Estado de entrega</h2><div class="table-wrap"><table>
    <thead><tr><th>Destinatario</th><th>Envío</th><th>Revisión</th><th><span class="muted" style="font-weight:400">Acciones</span></th></tr></thead>
    <tbody>${m.deliveries.map((d) => html`<tr>
      <td>${people[d.recipient]?.name}</td>
      <td><span class="chip ${DELIVERY[d.status][0]}">${DELIVERY[d.status][1]}</span></td>
      <td>${review(d)}${d.status === 'error' && d.reason && html`<span class="reason">${d.reason}</span>`}</td>
      <td>${m.sender === user.id && d.status === 'error' && deliveryAction(d, 'reintentar', 'Reintentar')}
        ${reviewer && d.status === 'held' && html`${deliveryAction(d, 'liberar', 'Liberar', true)} ${deliveryAction(d, 'descartar', 'Descartar')}`}</td>
    </tr>`)}</tbody></table></div>`}
</div>`;
