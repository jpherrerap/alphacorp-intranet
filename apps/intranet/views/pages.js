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
  .notice { padding: .5rem .75rem; border: 1px solid GrayText; border-radius: .4rem; }
`);

export const layout = (title, user, body) => html`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · AlphaCorp</title><style>${STYLE}</style></head>
<body><header><strong>AlphaCorp Intranet</strong>${user && html`<nav>
  <a href="/expedientes">Expedientes</a>
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
