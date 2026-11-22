import { html, Raw } from './html.js';

const STYLE = new Raw(`
  :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
  body { margin: 0; background: Canvas; color: CanvasText; }
  header { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;
           padding: .75rem 1rem; border-bottom: 1px solid GrayText; }
  nav { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
  main { max-width: 48rem; margin: 0 auto; padding: 1rem; }
  form { display: inline; }
  li { margin: .4rem 0; }
  .muted { color: GrayText; }
  fieldset { margin: .75rem 0; }
  textarea { width: 100%; box-sizing: border-box; }
  img, audio { max-width: 100%; display: block; margin: .4rem 0; }
  .notice { padding: .5rem .75rem; border: 1px solid GrayText; border-radius: .4rem; }
`);

export const layout = (title, user, body) => html`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · AlphaCorp</title><style>${STYLE}</style></head>
<body><header><strong>AlphaCorp Intranet</strong>${user && html`<nav>
  <a href="/expedientes">Expedientes</a>
  <a href="/asistente">Asistente</a>
  <a href="/correo">Correo</a>
  <span class="muted">${user.name} · ${user.area}</span>
  <form method="post" action="/logout"><button>Salir</button></form></nav>`}</header>
<main><h1>${title}</h1>${body}</main></body></html>`;

export const render = (res, title, user, body, status = 200) => res.status(status).send(layout(title, user, body).s);

export const login = (users) => html`<form method="post" action="/login">
  <label>Usuario <select name="user">${users.map((u) => html`<option value="${u.id}">${u.name} · ${u.area}</option>`)}</select></label>
  <button>Ingresar</button></form>
  <p class="muted">Datos ficticios. El usuario elegido define el rol que ve mosAIc.</p>`;

export const records = (list) => html`<ul>${list.map((r) => html`<li>
  <a href="/expedientes/${r.id}">${r.code}</a> · ${r.title} <span class="muted">vence el ${r.deadline}</span></li>`)}</ul>`;

export const record = (r, docs) => html`<p>${r.title}. Vence el ${r.deadline}.</p>
  <h2>Documentos</h2>
  ${docs.length ? html`<ul>${docs.map((d) => html`<li><a href="/documentos/${d.id}">${d.title}</a></li>`)}</ul>`
                : html`<p class="muted">Tu rol no tiene documentos de este expediente.</p>`}`;

export const document = (d) => html`<p>${d.body}</p><p><a href="/expedientes/${d.record_id}">Volver al expediente</a></p>`;

export const message = (text) => html`<p class="notice">${text}</p>`;

const OUTCOMES = {
  allow: 'La respuesta llegó completa a tu bandeja.',
  repair: 'mosAIc entregó una versión reparada de la respuesta.',
  review: 'La respuesta quedó en revisión humana y no llegó a tu bandeja.',
};

export const assistant = (tasks, inbox, outcome) => html`
  ${Object.hasOwn(OUTCOMES, outcome) && message(OUTCOMES[outcome])}
  <h2>Preguntar</h2>
  <ul>${Object.entries(tasks).map(([id, t]) => html`<li><form method="post" action="/asistente">
    <input type="hidden" name="task" value="${id}"><button>${t.question}</button></form></li>`)}</ul>
  <h2>Bandeja</h2>
  ${inbox.length ? html`<ul>${inbox.map((m) => html`<li>${m.text}</li>`)}</ul>` : html`<p class="muted">Sin mensajes.</p>`}`;

const STATUS = {
  pending: 'pendiente',
  delivered: 'entregado',
  repaired: 'entregado con el texto reparado por mosAIc',
  held: 'retenido por mosAIc',
  error: 'no entregado: mosAIc no respondió',
  released: 'liberado por Legal',
  discarded: 'descartado por Legal',
};

const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,application/pdf,audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4';

const mailList = (list, names, tasks, who) => list.length
  ? html`<ul>${list.map((m) => html`<li><a href="/correo/${m.id}">${tasks[m.task].question}</a>
      <span class="muted">${who(m, names)} · ${m.at}</span></li>`)}</ul>`
  : html`<p class="muted">Sin correos.</p>`;

const recipients = (m, names) => `para ${m.deliveries.map((d) => `${names[d.recipient]} (${STATUS[d.status]})`).join(', ')}`;

export const mail = ({ tasks, users, names, inbox, sent, held, notice }) => html`
  ${notice && message(notice)}
  <h2>Redactar</h2>
  <form method="post" action="/correo" enctype="multipart/form-data" style="display:block">
    <fieldset><legend>Para</legend>${users.map((u) => html`<label><input type="checkbox" name="to" value="${u.id}"> ${u.name}</label> `)}</fieldset>
    <p><label>Responde a <select name="task" required>${Object.entries(tasks).map(([id, t]) => html`<option value="${id}">${t.question}</option>`)}</select></label></p>
    <p><label>Texto<br><textarea name="body" rows="5" maxlength="4000" required></textarea></label></p>
    <p><label>Adjuntos (imagen, PDF o audio; hasta 4 y 4 MB en total)<br><input type="file" name="files" multiple accept="${ACCEPT}"></label></p>
    <button>Enviar</button>
  </form>
  <p class="muted">mosAIc revisa cada destinatario antes de entregar.</p>
  <h2>Recibidos</h2>
  ${mailList(inbox, names, tasks, (m, n) => `de ${n[m.sender]}`)}
  <h2>Enviados</h2>
  ${mailList(sent, names, tasks, recipients)}
  ${held && html`<h2>Retenidos por mosAIc</h2>${mailList(held, names, tasks, (m, n) => `de ${n[m.sender]}`)}`}`;

const attachmentView = (a) => {
  const src = `/correo/adjuntos/${a.id}`;
  if (a.media_type.startsWith('image/')) return html`<figure><img src="${src}" alt="${a.name}"><figcaption>${a.name}</figcaption></figure>`;
  if (a.media_type.startsWith('audio/')) return html`<p>${a.name}<audio controls src="${src}"></audio></p>`;
  return html`<p><a href="${src}">${a.name}</a> <span class="muted">PDF</span></p>`;
};

const deliveryAction = (d, action, label) => html`<form method="post" action="/correo/entregas/${encodeURIComponent(d.id)}/${action}"><button>${label}</button></form>`;

export const mailView = (m, names, user, reviewer) => html`
  <p class="muted">De ${names[m.sender]} · ${m.at}</p>
  <p style="white-space:pre-wrap">${m.text}</p>
  ${m.attachments.map(attachmentView)}
  ${m.deliveries && html`<h2>Entregas</h2><ul>${m.deliveries.map((d) => html`<li>${names[d.recipient]}: ${STATUS[d.status]}
    ${d.reason && html`<span class="muted">(${d.reason})</span>`}
    ${m.sender === user.id && d.status === 'error' && deliveryAction(d, 'reintentar', 'Reintentar')}
    ${reviewer && d.status === 'held' && html`${deliveryAction(d, 'liberar', 'Liberar')} ${deliveryAction(d, 'descartar', 'Descartar')}`}</li>`)}</ul>`}
  <p><a href="/correo">Volver al correo</a></p>`;
