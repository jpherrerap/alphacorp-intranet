import { SEEDED } from '@alphacorp/mail-engine';
import { html, Raw } from './html.js';

// Dark keeps the same structure; status tones lighten so they read as text too, and badges flip to dark ink.
const DARK = `
    --bg: #0e1418; --surface: #161f25; --fg: #e8eef2; --muted: #a9b6c1; --line: #2c3943; --hover: #1f2a31; --select: #173c44;
    --brand: #0a2f37; --accent: #5cc0d2; --accent-fg: #06222a; --accent-soft: #163a42; --accent-hover: #7fd0de; --field: #4d5c68;
    --ok: #5fd08f; --wait: #f0b44a; --fail: #ff8a7d; --info: #8fb4ff; --on-tone: #0b1216;
    color-scheme: dark;`;

// Familiar intranet software, enlarged for a projector: 20px base (growing to 26px on 1080p), nothing under 18px.
// The theme follows the OS until the person picks one with the toggle at the bottom of the rail.
const STYLE = new Raw(`
  :root {
    --bar: 4.5rem; --rail: 7rem;
    --bg: #eef1f4; --surface: #ffffff; --fg: #101820; --muted: #3e4a56; --line: #cfd6dd; --hover: #e6ecf1; --select: #d5e8ec;
    --brand: #0b4a57; --brand-fg: #ffffff; --accent: #0b6476; --accent-fg: #ffffff; --accent-soft: #dcecef;
    --ok: #146c3c; --wait: #8f5300; --fail: #b3261e; --info: #1d56b3; --on-tone: #ffffff;
    --accent-hover: #09505e; --field: #9aa6b1;
    --ease: cubic-bezier(.16, 1, .3, 1);
    color-scheme: light; font: clamp(20px, calc(6px + 1.05vw), 26px)/1.45 "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, "Noto Sans", sans-serif;
  }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {${DARK}
  } }
  :root[data-theme="dark"] {${DARK}
  }
  * { box-sizing: border-box; }
  html { scrollbar-color: var(--field) var(--bg); }
  body { margin: 0; background: var(--bg); color: var(--fg); caret-color: var(--accent); }
  ::selection { background: var(--accent); color: var(--accent-fg); }
  a { color: var(--accent); text-underline-offset: .18em; }
  h1 { font-size: 1.8rem; line-height: 1.15; margin: 0; letter-spacing: -.01em; text-wrap: balance; }
  h2 { font-size: 1.2rem; margin: 0; }
  p { margin: 0; }
  button, input, select, textarea { font: inherit; color: inherit; }
  :focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
  .icon { width: 1.2em; height: 1.2em; flex: none; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .muted { color: var(--muted); }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  form.inline { display: inline; }

  .bar { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; gap: 1.25rem; height: var(--bar); padding: 0 1.5rem;
         background: var(--brand); color: var(--brand-fg); }
  .brand { display: flex; align-items: center; gap: .7rem; color: inherit; text-decoration: none; font-weight: 700; font-size: 1.2rem; }
  .logo { width: 2.4rem; height: 2.4rem; flex: none; }
  .app-name { padding-left: 1.25rem; border-left: 1px solid rgb(255 255 255 / .35); font-size: 1.2rem; font-weight: 600; }
  .me { display: flex; align-items: center; gap: .8rem; margin-left: auto; }
  .me-name { font-weight: 700; line-height: 1.15; }
  .me-name small { display: block; font-size: .9rem; font-weight: 400; opacity: .9; }
  .bar .btn { background: transparent; border-color: rgb(255 255 255 / .5); color: inherit; }
  .bar .btn:hover { background: rgb(255 255 255 / .14); }

  .shell { display: grid; grid-template-columns: var(--rail) minmax(0, 1fr); min-height: calc(100dvh - var(--bar)); }
  .rail { position: sticky; top: var(--bar); align-self: start; display: flex; flex-direction: column; gap: .35rem; padding: .75rem .5rem;
          height: calc(100dvh - var(--bar)); background: var(--surface); border-right: 1px solid var(--line); }
  .rail a, .theme { display: grid; justify-items: center; gap: .2rem; padding: .7rem .25rem; border-radius: .5rem; color: var(--muted);
            text-decoration: none; font-size: .9rem; font-weight: 600; transition: background .2s, color .2s; }
  .rail a .icon { width: 1.8rem; height: 1.8rem; }
  .rail a:hover, .theme:hover { background: var(--hover); color: var(--fg); }
  /* Deliberately smaller than the app links: a setting, not a destination. */
  .theme { margin-top: auto; align-self: center; padding: .5rem; border: 0; background: transparent; cursor: pointer; }
  .theme .icon { width: 1.3rem; height: 1.3rem; }
  .theme.floating { position: fixed; left: 1rem; bottom: 1rem; width: auto; background: var(--surface); border: 1px solid var(--line); }
  :root[data-theme="dark"] .theme .to-dark, :root:not([data-theme="dark"]) .theme .to-light { display: none; }
  .theme > span { display: grid; place-items: center; }
  .rail a[aria-current="page"] { background: var(--accent-soft); color: var(--accent); }

  .page { width: 100%; max-width: 76rem; padding: 2rem 2.5rem 3rem; display: grid; gap: 1.5rem; align-content: start; }
  .pane { background: var(--surface); border: 1px solid var(--line); border-radius: .6rem; min-width: 0; }
  .pane-body { padding: 1.5rem 1.75rem; display: grid; gap: 1.25rem; align-content: start; }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: .55rem; min-height: 3rem; padding: .5rem 1.2rem;
         border-radius: .45rem; border: 1px solid var(--line); background: var(--surface); color: var(--fg); cursor: pointer;
         text-decoration: none; font-weight: 600; transition: background .2s; }
  .btn:hover { background: var(--hover); }
  .btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); }
  .btn.primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

  .notice { display: flex; align-items: center; gap: .9rem; padding: 1rem 1.25rem; border-radius: .6rem; font-size: 1.1rem; font-weight: 600;
            border: 2px solid var(--tone, var(--wait)); color: var(--tone, var(--wait));
            background: color-mix(in srgb, var(--tone, var(--wait)) 9%, var(--surface)); }
  .notice .icon { width: 1.6em; height: 1.6em; }
  .notice.big { font-size: 1.4rem; padding: 1.4rem 1.6rem; animation: rise .7s var(--ease) both; }
  .notice.big .icon { animation: settle .8s var(--ease) .15s both; }

  /* State never depends on colour alone: every badge carries its own icon. */
  .badge { display: inline-flex; align-items: center; gap: .45rem; padding: .3rem .85rem .3rem .65rem; border-radius: 2rem;
           background: var(--tone); color: var(--on-tone); font-weight: 700; white-space: nowrap; }
  .badge.small { font-size: .9rem; padding: .15rem .65rem .15rem .5rem; }
  .ok { --tone: var(--ok); } .wait { --tone: var(--wait); } .fail { --tone: var(--fail); } .info { --tone: var(--info); }
  .tag { display: inline-flex; align-items: center; gap: .4rem; font-size: .9rem; padding: .15rem .7rem; border-radius: .35rem;
         background: var(--accent-soft); color: var(--accent); font-weight: 700; }

  .avatar { display: inline-grid; place-items: center; flex: none; width: 2.6rem; height: 2.6rem; border-radius: 50%;
            background: var(--av, var(--accent)); color: #fff; font-weight: 700; font-size: .9rem; letter-spacing: .02em; }
  .avatar.lg { width: 3.4rem; height: 3.4rem; font-size: 1.1rem; }
  .avatar.xl { width: 5rem; height: 5rem; font-size: 1.6rem; }

  /* Mail: Outlook's three panes (folders, list, reading), each scrolling on its own. */
  .mail { display: grid; grid-template-columns: 13rem minmax(18rem, 30vw) minmax(0, 1fr); height: calc(100dvh - var(--bar)); }
  .mail.wide { grid-template-columns: 13rem minmax(0, 1fr); }
  .mail > * { overflow-y: auto; min-width: 0; }
  .folders { display: grid; gap: 1rem; align-content: start; padding: 1.25rem 1rem; background: var(--surface); border-right: 1px solid var(--line); }
  .folders nav { display: grid; gap: .25rem; }
  .folders nav a { display: flex; align-items: center; gap: .7rem; padding: .7rem .8rem; border-radius: .45rem; color: var(--fg);
                   text-decoration: none; font-weight: 600; transition: background .2s; }
  .folders nav a:hover { background: var(--hover); }
  .folders nav a[aria-current="page"] { background: var(--select); color: var(--accent); }
  .count { margin-left: auto; font-size: .9rem; font-weight: 700; min-width: 2rem; text-align: center; padding: 0 .5rem; border-radius: 1rem;
           background: var(--accent); color: var(--accent-fg); }
  .list-pane { background: var(--surface); border-right: 1px solid var(--line); }
  .list-pane > header, .reading > header { position: sticky; top: 0; z-index: 1; padding: 1.25rem 1.5rem; background: inherit; border-bottom: 1px solid var(--line); }
  .reading { background: var(--surface); }
  .reading-empty { display: grid; place-items: center; align-content: center; gap: 1rem; height: 100%; color: var(--muted); font-size: 1.2rem; background: var(--bg); }
  .reading-empty .icon { width: 5rem; height: 5rem; stroke-width: 1.25; }

  .rows { list-style: none; margin: 0; padding: 0; }
  .rows a { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .9rem; padding: 1rem 1.5rem; border-bottom: 1px solid var(--line);
            color: inherit; text-decoration: none; transition: background .2s; }
  .rows a:hover { background: var(--hover); }
  .rows a[aria-current="true"] { background: var(--select); }
  .row-top { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
  .row-top time { color: var(--muted); font-size: .9rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .who, .subject, .preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .who { font-weight: 600; }
  .subject { display: flex; align-items: center; gap: .4rem; }
  .subject span { overflow: hidden; text-overflow: ellipsis; }
  .preview { color: var(--muted); font-size: .9rem; }
  .unread .who, .unread .subject { font-weight: 800; }
  .unread .who::before { content: ""; display: inline-block; width: .6rem; height: .6rem; margin-right: .5rem; border-radius: 50%; background: var(--accent); vertical-align: .12rem; }
  .chips { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .5rem; }
  .empty { padding: 3rem 1.5rem; text-align: center; color: var(--muted); font-size: 1.1rem; }

  .meta { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: .15rem 1rem; align-items: center; }
  .meta .avatar { grid-row: span 3; align-self: start; }
  .meta strong { font-size: 1.1rem; }
  .meta time, .addr { color: var(--muted); font-size: .9rem; }
  .msg-body { white-space: pre-wrap; font-size: 1.15rem; max-width: 60ch; }
  .files { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr)); gap: 1rem; }
  .file { border: 1px solid var(--line); border-radius: .5rem; padding: .75rem; display: grid; gap: .5rem; min-width: 0; }
  .file img { width: 100%; border-radius: .3rem; display: block; }
  .file audio { width: 100%; }
  .file-name { font-size: .9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* The signature moment: recipients resolve one after another, each outcome settling into place. */
  .outcomes { display: grid; gap: .75rem; container-type: inline-size; }
  .outcome { display: grid; grid-template-columns: minmax(11rem, 15rem) 15rem minmax(0, 1fr) auto; align-items: center; gap: .6rem 1.25rem;
             padding: 1rem 1.25rem; border: 1px solid var(--line); overflow-x: clip;
             border-radius: .6rem; background: color-mix(in srgb, var(--tone) 6%, var(--surface));
             animation: rise .6s var(--ease) calc(var(--i) * 140ms) both; }
  .outcome .person { display: flex; align-items: center; gap: .8rem; font-size: 1.2rem; font-weight: 700; min-width: 0; }
  .outcome .badge { justify-self: start; transform-origin: left center; font-size: 1.15rem; padding: .45rem 1.1rem .45rem .8rem; animation: settle .7s var(--ease) calc(var(--i) * 140ms + 120ms) both; }
  .outcome .review { font-weight: 600; }
  .outcome .actions:empty { display: none; }
  @container (max-width: 60rem) {
    .outcome { grid-template-columns: minmax(0, 1fr) auto; }
    .outcome .review, .outcome .actions { grid-column: 1 / -1; }
    .outcome .badge { transform-origin: right center; }
  }
  @container (max-width: 26rem) {
    .outcome { grid-template-columns: minmax(0, 1fr); }
    .outcome .badge { white-space: normal; font-size: 1rem; transform-origin: left center; }
  }
  .reason { display: block; color: var(--muted); font-size: .9rem; font-weight: 400; }
  .outcome .actions { display: flex; flex-wrap: wrap; gap: .5rem; }

  .compose { display: grid; gap: 1.1rem; max-width: 60rem; }
  .field { display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: .75rem; align-items: center; }
  .field > span { color: var(--muted); font-weight: 600; }
  .field input[type=text], .field select, textarea { width: 100%; min-height: 3rem; padding: .55rem .8rem; border: 1px solid var(--field);
         border-radius: .45rem; background: var(--surface); }
  .attach { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
  .attach label:has(input:focus-visible) { outline: 3px solid var(--accent); outline-offset: 2px; }
  textarea { min-height: 13rem; resize: vertical; font-size: 1.1rem; }
  .pills { display: flex; flex-wrap: wrap; gap: .6rem; }
  .pill { display: inline-flex; align-items: center; gap: .6rem; padding: .35rem 1rem .35rem .4rem; border: 2px solid var(--line);
          border-radius: 2.5rem; cursor: pointer; font-weight: 600; transition: background .2s, border-color .2s; }
  .pill:has(input:checked) { border-color: var(--accent); background: var(--accent-soft); }
  .pill input { position: absolute; opacity: 0; pointer-events: none; }
  .pill:has(input:focus-visible) { outline: 3px solid var(--accent); outline-offset: 2px; }
  .pill .check { display: none; color: var(--accent); }
  .pill:has(input:checked) .check { display: block; }
  .compose footer { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
  .compose footer .muted { flex: 1 1 20rem; font-size: .9rem; }

  .big-rows { list-style: none; margin: 0; padding: 0; }
  .big-rows a { display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem 1.75rem; border-bottom: 1px solid var(--line);
                color: inherit; text-decoration: none; transition: background .2s; }
  .big-rows li:last-child a { border-bottom: 0; }
  .big-rows a:hover { background: var(--hover); }
  .big-rows .icon.lead { width: 2.4rem; height: 2.4rem; color: var(--accent); }
  .big-rows strong { font-size: 1.4rem; }
  .big-rows .grow { flex: 1; min-width: 0; }
  .when { display: inline-flex; align-items: center; gap: .45rem; font-weight: 600; color: var(--muted); }
  .doc-text { font-size: 1.6rem; font-weight: 600; max-width: 40ch; }

  .split { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 1.5rem; align-items: start; }
  .ask { display: grid; gap: .75rem; }
  .ask .btn { width: 100%; justify-content: flex-start; min-height: 3.8rem; padding: .75rem 1.1rem; text-align: left; font-size: 1.1rem; }
  .ask .btn .icon { color: var(--accent); }
  .bubbles { list-style: none; margin: 0; padding: 0; display: grid; gap: .75rem; }
  .bubbles li { padding: 1rem 1.2rem; border-radius: .2rem 1rem 1rem 1rem; background: var(--accent-soft); font-size: 1.15rem; font-weight: 600; }

  .login { display: grid; place-items: center; min-height: calc(100dvh - var(--bar)); padding: 2rem 1rem; }
  .login form { width: min(100%, 52rem); }
  .people { display: grid; grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr)); gap: 1rem; }
  .person-btn { display: flex; align-items: center; gap: 1.1rem; padding: 1.1rem 1.25rem; border: 2px solid var(--line); border-radius: .6rem;
                background: var(--surface); cursor: pointer; text-align: left; transition: border-color .2s, background .2s; }
  .person-btn:hover { border-color: var(--accent); background: var(--accent-soft); }
  .person-btn strong { display: block; font-size: 1.3rem; }

  @keyframes rise { from { transform: translateY(1rem); } }
  @keyframes settle { from { transform: scale(1.35); } }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }

  /* Like Outlook on a narrow screen, an open email collapses the folder pane to icons and keeps the list. */
  @media (max-width: 1440px) {
    .mail.open { grid-template-columns: 5.5rem minmax(16rem, 28vw) minmax(0, 1fr); }
    .mail.open .folders { padding: 1.25rem .6rem; }
    .mail.open .folders .label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    .mail.open .folders a { justify-content: center; padding-inline: .4rem; gap: .3rem; }
    .mail.open .folders .count { margin-left: 0; min-width: 1.6rem; padding: 0 .3rem; }
    /* The narrowed list wraps sender and subject instead of truncating them, and drops the preview. */
    .mail.open .rows a { padding: .9rem 1rem; }
    .mail.open .row-top { flex-direction: column; gap: 0; }
    .mail.open .who, .mail.open .subject span { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
    .mail.open .preview { display: none; }
  }
  @media (max-width: 1100px) {
    .mail, .mail.wide, .mail.open { grid-template-columns: minmax(0, 1fr); height: auto; }
    .mail.open .list-pane { display: none; }
    .mail > * { overflow: visible; }
    .folders { display: flex; flex-wrap: wrap; align-items: center; border-right: 0; border-bottom: 1px solid var(--line); }
    .folders nav { display: flex; flex-wrap: wrap; }
    .reading-empty { display: none; }
  }
  @media (max-width: 760px) {
    :root { --rail: 4.5rem; }
    .rail a { font-size: 0; }
    .app-name, .me-name, .brand-name, .bar .btn span { display: none; }
    .bar { gap: .75rem; padding: 0 1rem; }
    .meta { grid-template-columns: auto minmax(0, 1fr); }
    .meta time, .meta > div:last-child { grid-column: 2; }
    .page { padding: 1.25rem 1rem 2rem; }
    .pane-body { padding: 1.25rem 1rem; }
    .split { grid-template-columns: minmax(0, 1fr); }
    .field { grid-template-columns: minmax(0, 1fr); }
  }
`);

const ICONS = {
  inbox: ['M22 12h-6l-2 3h-4l-2-3H2', 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  send: ['M22 2 11 13', 'M22 2 15 22 11 13 2 9 22 2z'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  pencil: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'],
  folder: ['M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z'],
  chat: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 6-10 7L2 6'],
  check: ['M20 6 9 17l-5-5'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  wrench: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
  unlock: ['M7 11V7a5 5 0 0 1 9.9-1', 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z'],
  alert: ['M12 9v4', 'M12 17h.01', 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'],
  clip: ['M21 11.5 12.5 20a5 5 0 0 1-7-7L14 4.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3L15 7.5'],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
  back: ['m12 19-7-7 7-7', 'M19 12H5'],
  moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  sun: ['M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2', 'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  calendar: ['M8 2v4', 'M16 2v4', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M3 10h18'],
};
const icon = (name, cls = '') => new Raw(`<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name].map((d) => `<path d="${d}"/>`).join('')}</svg>`);
const LOGO = new Raw('<svg class="logo" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#fff"/><path d="M11 30 20 9l9 21" fill="none" stroke="#0b4a57" stroke-width="4.5" stroke-linejoin="round"/><path d="M15.6 22.5h8.8" stroke="#e8a317" stroke-width="4"/></svg>');

const APPS = [['expedientes', 'Expedientes', 'folder'], ['asistente', 'Asistente', 'chat'], ['correo', 'Correo', 'mail']];
const current = (on, value = 'page') => new Raw(on ? `aria-current="${value}"` : '');
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');
// Each person keeps one colour everywhere, as in Outlook, so the room can follow who is who.
const AVATAR = ['#0b6476', '#6a3d9a', '#a8431b', '#1d56b3', '#2b6e2f', '#8a3471'];
const hue = (id) => AVATAR[[...id].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATAR.length];
const avatar = (user, size = '') => html`<span class="avatar ${size}" style="--av:${user ? hue(user.id) : '#3e4a56'}" aria-hidden="true">${user ? initials(user.name) : '?'}</span>`;

// Pages that bring their own heading (mailbox, login) mark themselves as full so the layout skips its h1.
const full = (raw) => Object.assign(raw, { full: true });

// The chosen theme lives in a cookie the server reads, so the page renders in it with no flash; without one the OS decides.
const THEME_FLIP = "const r=document.documentElement,d=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;"
  + "r.dataset.theme=d?'light':'dark';document.cookie='theme='+r.dataset.theme+';path=/;max-age=31536000;samesite=lax'";
const themeOf = (cookie = '') => /(?:^|;\s*)theme=(dark|light)(?:;|$)/.exec(cookie)?.[1];
const themeToggle = (cls) => html`<button type="button" class="theme ${cls}" title="Cambiar tema" onclick="${THEME_FLIP}">
  <span class="to-dark">${icon('moon')}<span class="sr-only">Tema oscuro</span></span><span class="to-light">${icon('sun')}<span class="sr-only">Tema claro</span></span></button>`;

export const layout = (title, user, body, path = '', theme) => {
  const section = path.split('/')[1];
  // Documents belong to a record, so they live under Expedientes.
  const app = APPS.find(([id]) => (section === 'documentos' ? 'expedientes' : section) === id);
  return html`<!doctype html>
<html lang="es" ${new Raw(theme ? `data-theme="${theme}"` : '')}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · AlphaCorp</title><style>${STYLE}</style></head>
<body><header class="bar"><a class="brand" href="/">${LOGO}<span class="brand-name">AlphaCorp</span></a>${app && html`<span class="app-name">${app[1]}</span>`}${user && html`
  <div class="me">${avatar(user, 'lg')}<span class="me-name">${user.name}<small>${user.area}</small></span>
    <form class="inline" method="post" action="/logout"><button class="btn" aria-label="Salir">${icon('logout')}<span>Salir</span></button></form></div>`}</header>
${user ? html`<div class="shell"><nav class="rail" aria-label="Aplicaciones">${APPS.map(([id, label, ico]) => html`
  <a href="/${id}" ${current(app?.[0] === id)}>${icon(ico)}${label}</a>`)}${themeToggle('')}</nav>
<main>${body.full ? body : html`<div class="page"><h1>${title}</h1>${body}</div>`}</main></div>` : html`<main>${body}</main>${themeToggle('floating')}`}</body></html>`;
};

export const render = (res, title, user, body, status = 200) =>
  res.status(status).send(layout(title, user, body, res.req.path, themeOf(res.req.headers.cookie)).s);

export const login = (users) => full(html`<div class="login"><form class="pane-body" method="post" action="/login">
  <h1>Ingresar a la intranet</h1>
  <div class="people">${users.map((u) => html`<button class="person-btn" name="user" value="${u.id}">${avatar(u, 'xl')}
    <span><strong>${u.name}</strong><span class="muted">${u.area}</span></span></button>`)}</div>
  <p class="muted">Datos ficticios. La persona elegida define el rol que ve mosAIc.</p></form></div>`);

export const records = (list) => html`<div class="pane"><ul class="big-rows">${list.map((r) => html`<li>
  <a href="/expedientes/${r.id}">${icon('folder', 'lead')}<span class="grow"><strong>${r.code}</strong><br>${r.title}</span>
    <span class="when">${icon('calendar')}Vence el ${r.deadline}</span></a></li>`)}</ul></div>`;

export const record = (r, docs) => html`<p class="when">${icon('calendar')}${r.title} · vence el ${r.deadline}</p>
  <div class="pane"><header class="pane-body" style="border-bottom:1px solid var(--line)"><h2>Documentos</h2></header>
  ${docs.length ? html`<ul class="big-rows">${docs.map((d) => html`<li><a href="/documentos/${d.id}">${icon('file', 'lead')}<strong class="grow">${d.title}</strong></a></li>`)}</ul>`
                : html`<p class="empty">Tu rol no tiene documentos de este expediente.</p>`}</div>`;

export const document = (d) => html`<div class="pane pane-body"><p class="doc-text">${d.body}</p>
  <p><a class="btn" href="/expedientes/${d.record_id}">${icon('back')}Volver al expediente</a></p></div>`;

const NOTICE_ICON = { ok: 'check', info: 'wrench', wait: 'shield', fail: 'alert' };
export const message = (text, tone = 'wait', big = false) =>
  html`<p class="notice ${tone} ${big ? 'big' : ''}" role="status">${icon(NOTICE_ICON[tone])}${text}</p>`;

const OUTCOMES = {
  allow: ['ok', 'La respuesta llegó completa a tu bandeja.'],
  repair: ['info', 'mosAIc entregó una versión reparada de la respuesta.'],
  review: ['wait', 'La respuesta quedó en revisión humana y no llegó a tu bandeja.'],
};

// The bar already names the app, so the heading stays for screen readers and the four questions fit a 720p projector.
export const assistant = (tasks, inbox, outcome) => full(html`<div class="page"><h1 class="sr-only">Asistente</h1>
  ${Object.hasOwn(OUTCOMES, outcome) && message(OUTCOMES[outcome][1], OUTCOMES[outcome][0], true)}
  <div class="split">
    <section class="pane pane-body"><h2>Preguntar</h2><div class="ask">${Object.entries(tasks).map(([id, t]) => html`
      <form method="post" action="/asistente"><input type="hidden" name="task" value="${id}"><button class="btn">${icon('chat')}${t.question}</button></form>`)}</div></section>
    <section class="pane pane-body"><h2>Tu bandeja</h2>
      ${inbox.length ? html`<ul class="bubbles">${inbox.map((m) => html`<li>${m.text}</li>`)}</ul>` : html`<p class="empty">Sin mensajes.</p>`}</section>
  </div></div>`);

// --- Correo ---

const ZONE = 'America/Santiago';
const shortDate = (iso) => {
  const d = new Date(iso);
  const sameDay = d.toLocaleDateString('es-CL', { timeZone: ZONE }) === new Date().toLocaleDateString('es-CL', { timeZone: ZONE });
  return d.toLocaleString('es-CL', sameDay ? { hour: '2-digit', minute: '2-digit', timeZone: ZONE } : { day: 'numeric', month: 'short', timeZone: ZONE });
};
const longDate = (iso) => new Date(iso).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short', timeZone: ZONE });
const address = (id) => `${id}@alphacorp.cl`;

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
const STATUS_ICON = { delivered: 'check', repaired: 'wrench', released: 'unlock', pending: 'clock', held: 'shield', error: 'alert', discarded: 'x' };
const TONE = { repaired: 'info', released: 'info' };
const tone = (status) => TONE[status] ?? DELIVERY[status][0];
const chip = (d, people) => html`<span class="badge small ${tone(d.status)}">${icon(STATUS_ICON[d.status])}${people[d.recipient]?.name.split(' ')[0]} · ${SHORT[d.status]}</span>`;

const FOLDERS = [['inbox', '/correo', 'Recibidos', 'inbox'], ['sent', '/correo/enviados', 'Enviados', 'send'], ['held', '/correo/retenidos', 'Retenidos', 'shield']];

export const mailbox = ({ title, folder, counts, list, reading }) => {
  const name = FOLDERS.find(([id]) => id === folder)?.[2];
  return full(html`<div class="mail ${list ? '' : 'wide'} ${list && reading ? 'open' : ''}">
  <aside class="folders">
    <a class="btn primary" href="/correo/redactar">${icon('pencil')}<span class="label">Redactar</span></a>
    <nav aria-label="Carpetas">${FOLDERS.filter(([id]) => id !== 'held' || counts.held !== null).map(([id, href, label, ico]) => html`
      <a href="${href}" ${current(folder === id)}>${icon(ico)}<span class="label">${label}</span> ${counts[id] > 0 && html`<span class="count">${counts[id]}</span>`}</a>`)}
    </nav>
  </aside>
  ${list && html`<section class="list-pane" aria-label="${name}"><header>${reading ? html`<h2>${name}</h2>` : html`<h1>${title}</h1>`}</header>${list}</section>`}
  ${reading ? html`<section class="reading"><header><h1>${title}</h1></header>${reading}</section>`
            : html`<div class="reading-empty">${icon('mail')}<p>Elige un correo para leerlo</p></div>`}
</div>`);
};

const row = ({ href, person, who, at, subject, files, preview, unread, extra, selected }) => html`<li><a href="${href}" class="${unread ? 'unread' : ''}" ${current(selected, 'true')}>
  ${avatar(person)}
  <div style="min-width:0"><div class="row-top"><span class="who">${who}</span><time datetime="${at}">${shortDate(at)}</time></div>
    <div class="subject"><span>${subject}</span>${files > 0 && html`<span title="Con adjuntos">${icon('clip')}</span>`}</div>
    <div class="preview">${preview}</div>${extra}</div></a></li>`;

export function mailList(kind, list, people, selected) {
  if (!list.length) return html`<p class="empty">No hay correos en esta carpeta.</p>`;
  const rows = list.map((m) => {
    if (kind === 'inbox') {
      const note = m.status === 'repaired' || m.status === 'released';
      return row({ href: `/correo/${m.id}`, person: people[m.sender], who: people[m.sender]?.name, at: m.at, subject: m.subject, selected: m.id === selected,
        files: m.files, preview: m.text, unread: !m.read_at, extra: note && html`<div class="chips"><span class="badge small info">${icon(STATUS_ICON[m.status])}${review(m)}</span></div>` });
    }
    const shown = kind === 'held' ? m.deliveries.filter((d) => d.status === 'held') : m.deliveries;
    const who = kind === 'held' ? `De ${people[m.sender]?.name} · para ${shown.map((d) => people[d.recipient]?.name).join(', ')}`
      : `Para: ${m.deliveries.map((d) => people[d.recipient]?.name).join(', ')}`;
    return row({ href: `/correo/${m.id}`, person: people[kind === 'held' ? m.sender : m.deliveries[0]?.recipient], who, at: m.at, selected: m.id === selected,
      subject: m.subject, files: m.attachments.length, preview: m.body, extra: html`<div class="chips">${shown.map((d) => chip(d, people))}</div>` });
  });
  return html`<ul class="rows">${rows}</ul>`;
}

const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,application/pdf,audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4';

export const compose = ({ people, classifications, notice, draft }) => html`<form class="pane-body compose" method="post" action="/correo" enctype="multipart/form-data">
  ${notice && message(notice, 'fail')}
  <div class="field"><span>Para</span><div class="pills">${people.map((u) => html`<label class="pill">
    <input type="checkbox" name="to" value="${u.id}" ${new Raw(draft.to?.includes(u.id) ? 'checked' : '')}>${avatar(u)}${u.name}${icon('check', 'check')}</label>`)}</div></div>
  <label class="field"><span>Asunto</span><input type="text" id="subject" name="subject" maxlength="150" required value="${draft.subject ?? ''}"></label>
  <label class="field"><span>Clasificación</span><select id="task" name="task" required>
    <option value="">Elige el tema del correo</option>
    ${Object.entries(classifications).map(([id, label]) => html`<option value="${id}" ${new Raw(draft.task === id ? 'selected' : '')}>${label}</option>`)}</select></label>
  <textarea id="body" name="body" maxlength="3900" required aria-label="Texto del correo" placeholder="Escribe tu mensaje">${draft.body ?? ''}</textarea>
  <div class="field"><span>Adjuntos</span><div class="attach"><label class="btn">${icon('clip')}Adjuntar archivos
    <input class="sr-only" type="file" id="files" name="files" multiple accept="${ACCEPT}"
      onchange="this.closest('.attach').querySelector('output').value=[...this.files].map((f)=>f.name).join(', ')"></label>
    <output for="files" class="muted"></output></div></div>
  <footer><button class="btn primary">${icon('send')}Enviar</button>
    <span class="muted">Imágenes, PDF o audio: hasta 4 archivos y 4 MB. mosAIc revisa cada envío antes de entregarlo.</span></footer>
</form>`;

const fileView = (a) => {
  const src = `/correo/adjuntos/${a.id}`;
  const size = a.size >= 1e6 ? `${(a.size / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(a.size / 1e3))} KB`;
  const label = html`<div class="file-name">${a.name} <span class="muted">· ${size}</span></div>`;
  if (a.media_type.startsWith('image/')) return html`<div class="file"><a href="${src}"><img src="${src}" alt="${a.name}"></a>${label}</div>`;
  if (a.media_type.startsWith('audio/')) return html`<div class="file"><audio controls src="${src}"></audio>${label}</div>`;
  return html`<div class="file"><a class="btn" href="${src}">${icon('file')}Abrir PDF</a>${label}</div>`;
};

const deliveryAction = (d, action, label, primary) => html`<form class="inline" method="post" action="/correo/entregas/${encodeURIComponent(d.id)}/${action}">
  <button class="btn ${primary ? 'primary' : ''}">${label}</button></form>`;

export const mailView = (m, people, classes, user, reviewer) => html`<div class="pane-body">
  ${m.deliveries && html`<h2>Estado de entrega</h2><div class="outcomes">${m.deliveries.map((d, i) => html`
    <div class="outcome ${tone(d.status)}" style="--i:${i}">
      <span class="person">${avatar(people[d.recipient])}${people[d.recipient]?.name}</span>
      <span class="badge">${icon(STATUS_ICON[d.status])}${DELIVERY[d.status][1]}</span>
      <span class="review">${review(d)}${d.status === 'error' && d.reason && !d.reason.startsWith(review(d)) && html`<span class="reason">${d.reason}</span>`}</span>
      <span class="actions">${m.sender === user.id && d.status === 'error' && deliveryAction(d, 'reintentar', 'Reintentar')}
        ${reviewer && d.status === 'held' && html`${deliveryAction(d, 'liberar', 'Liberar', true)} ${deliveryAction(d, 'descartar', 'Descartar')}`}</span>
    </div>`)}</div>`}
  <div class="meta">${avatar(people[m.sender], 'lg')}
    <div><strong>${people[m.sender]?.name}</strong> <span class="addr">&lt;${address(m.sender)}&gt;</span></div>
    <time datetime="${m.at}">${longDate(m.at)}</time>
    <div class="addr">Para: ${(m.to ?? m.deliveries.map((d) => d.recipient)).map((id) => people[id]?.name).join(', ')}</div>
    <div><span class="tag">${classes[m.task] ?? 'General'}</span></div>
  </div>
  <div class="msg-body">${m.text}</div>
  ${m.attachments.length > 0 && html`<div class="files">${m.attachments.map(fileView)}</div>`}
</div>`;
