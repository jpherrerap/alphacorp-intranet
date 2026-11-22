---
name: AlphaCorp Intranet
description: Microsoft-365-class company intranet with an Outlook-style mailbox, enlarged for a projector.
colors:
  brand-teal: "#0b4a57"
  accent-teal: "#0b6476"
  accent-teal-deep: "#09505e"
  accent-wash: "#dcecef"
  selection-wash: "#d5e8ec"
  status-delivered: "#146c3c"
  status-waiting: "#8f5300"
  status-failed: "#b3261e"
  status-repaired: "#1d56b3"
  office-ground: "#eef1f4"
  pane-white: "#ffffff"
  ink: "#101820"
  slate-muted: "#3e4a56"
  hairline: "#cfd6dd"
  field-stroke: "#9aa6b1"
  hover-wash: "#e6ecf1"
typography:
  display:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "1.8rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline-large:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "1.6rem"
    fontWeight: 600
    lineHeight: 1.3
  headline:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.3
  title-large:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.3
  body-reading:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.45
  body-lead:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "1.1rem"
    fontWeight: 600
    lineHeight: 1.45
  body:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "\"Segoe UI Variable Text\", \"Segoe UI\", system-ui, -apple-system, \"Noto Sans\", sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.45
rounded:
  nib: "0.2rem"
  thumb: "0.3rem"
  tag: "0.35rem"
  control: "0.45rem"
  tile: "0.5rem"
  pane: "0.6rem"
  soft: "1rem"
  pill: "2rem"
  pill-lg: "2.5rem"
  circle: "50%"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  base: "1rem"
  lg: "1.25rem"
  xl: "1.5rem"
  2xl: "2rem"
  3xl: "2.5rem"
components:
  button-default:
    backgroundColor: "{colors.pane-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.2rem"
    height: "3rem"
  button-default-hover:
    backgroundColor: "{colors.hover-wash}"
  button-primary:
    backgroundColor: "{colors.accent-teal}"
    textColor: "{colors.pane-white}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.2rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-teal-deep}"
  app-bar:
    backgroundColor: "{colors.brand-teal}"
    textColor: "{colors.pane-white}"
    height: "4.5rem"
    padding: "0 1.5rem"
  rail-item:
    textColor: "{colors.slate-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.tile}"
    padding: "0.7rem 0.25rem"
  rail-item-active:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent-teal}"
  folder-item:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.7rem 0.8rem"
  folder-item-active:
    backgroundColor: "{colors.selection-wash}"
    textColor: "{colors.accent-teal}"
  folder-count:
    backgroundColor: "{colors.accent-teal}"
    textColor: "{colors.pane-white}"
    typography: "{typography.label}"
    rounded: "{rounded.soft}"
  pane:
    backgroundColor: "{colors.pane-white}"
    rounded: "{rounded.pane}"
    padding: "1.5rem 1.75rem"
  message-row:
    backgroundColor: "{colors.pane-white}"
    padding: "1rem 1.5rem"
  message-row-selected:
    backgroundColor: "{colors.selection-wash}"
  badge-delivered:
    backgroundColor: "{colors.status-delivered}"
    textColor: "{colors.pane-white}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.85rem 0.3rem 0.65rem"
  badge-waiting:
    backgroundColor: "{colors.status-waiting}"
    textColor: "{colors.pane-white}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.85rem 0.3rem 0.65rem"
  badge-failed:
    backgroundColor: "{colors.status-failed}"
    textColor: "{colors.pane-white}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.85rem 0.3rem 0.65rem"
  badge-repaired:
    backgroundColor: "{colors.status-repaired}"
    textColor: "{colors.pane-white}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.85rem 0.3rem 0.65rem"
  outcome-row:
    rounded: "{rounded.pane}"
    padding: "1rem 1.25rem"
  tag:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent-teal}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "0.15rem 0.7rem"
  text-field:
    backgroundColor: "{colors.pane-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.55rem 0.8rem"
    height: "3rem"
  recipient-pill-selected:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill-lg}"
    padding: "0.35rem 1rem 0.35rem 0.4rem"
  attach-button:
    backgroundColor: "{colors.pane-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.2rem"
    height: "3rem"
  reply-bubble:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.ink}"
    typography: "{typography.body-reading}"
    padding: "1rem 1.2rem"
  person-button:
    backgroundColor: "{colors.pane-white}"
    rounded: "{rounded.pane}"
    padding: "1.1rem 1.25rem"
---

# Design System: AlphaCorp Intranet

## Overview

**Creative North Star: "The Back-Row Office Suite"**

This is ordinary Microsoft-365-class office software, the kind every person in the room has used, set at a scale the back row can read. The structure is the category standard: a deep-teal app bar that says whose screen it is, a narrow icon rail that says which app is open, white panes on a cool grey ground, and in Correo the three Outlook panes (folders, message list, reading pane). Nothing is themed. The look earns trust by being familiar.

The projector sets the scale. The root type size grows with the viewport from 20px to 26px (clamp(20px, calc(6px + 1.05vw), 26px)), reaching its maximum around a 1080p projector, and no text is smaller than 18px. Controls are at least 3rem tall, avatars run up to 5rem, and status shows as solid, saturated pills that each carry their own drawn icon. The ground follows the operating system: light by default, which holds up best in a lit room, and a dark theme with the same structure when the OS asks for it. A Claro/Oscuro toggle at the bottom of the rail (floating bottom-left on login) overrides the OS and is remembered in a `theme` cookie the server reads, so the page renders in the chosen theme with no flash. Depth comes from hairline borders and tonal washes, never from shadows.

One moment moves: when a message's delivery outcomes appear, the rows rise into place one after another and each status badge settles from a slight overscale. The assistant's big outcome notice uses the same rise-and-settle. Everything else changes state with a 0.2s colour fade, and all motion stops under reduced-motion.

**Key Characteristics:**
- Category-standard intranet shell: teal app bar, 7rem icon rail, white panes, three-pane mailbox.
- A fluid 20px-to-26px root, an 18px floor, generous 3rem-minimum hit targets. Every size is in rem, so the whole interface scales together.
- Light office ground by default; `prefers-color-scheme: dark` swaps the tokens for a dark ground (#0e1418), dark panes (#161f25), a light teal accent (#5cc0d2), lighter status tones (#5fd08f, #f0b44a, #ff8a7d, #8fb4ff) and dark badge ink (`--on-tone` #0b1216).
- Four solid status tones, each always paired with an icon.
- Flat: hairline borders and tonal washes, no shadows.
- One signature motion (outcome rows rising, badges settling), with every other transition a quiet colour fade.

## Colors

A cool, low-chroma office palette anchored by one deep teal, with four saturated status tones held back for outcomes.

### Primary
- **AlphaCorp Deep Teal** (brand-teal): the app bar ground only, under white text and the logo. It is the one large block of colour on every screen.
- **Working Teal** (accent-teal): primary buttons (Redactar, Enviar, Liberar), unread dots, folder counts, the active rail and folder text, links, focus outlines, text selection, and the caret.
- **Pressed Teal** (accent-teal-deep): primary-button hover.
- **Teal Wash** (accent-wash): the active rail item, tags, selected recipient pills, assistant reply bubbles, and the person-button hover.
- **Selection Wash** (selection-wash): the active folder and the selected message row. It is a touch greener than Teal Wash so a selected row reads differently from a hover.

### Secondary (status tones)
- **Delivered Green** (status-delivered): Entregado. Check icon.

Each delivery status has exactly one icon, and the set never changes: check, shield, clock, alert triangle, x, wrench, unlock.
- **Waiting Amber** (status-waiting): En espera. Shield icon when held for review (Retenido), clock while mosAIc is being consulted (Consultando).
- **Failed Red** (status-failed): No entregado (alert triangle icon) and Descartado (x icon), plus form error notices.
- **Repaired Blue** (status-repaired): Reparado (wrench icon) and Liberado (unlock icon).

Each tone carries white bold text when it fills a badge. The same tone also tints its outcome row (6% mixed into white) and its notice (9% mixed into white, with a 2px border and text in the full tone).

### Neutral
- **Office Ground** (office-ground): the page background behind panes, plus the empty reading pane.
- **Pane White** (pane-white): every pane, rail, folder column, list, field, and default button.
- **Ink** (ink): body text and headings.
- **Slate** (slate-muted): secondary text such as timestamps, addresses, previews, field labels, and inactive rail labels. It reaches roughly 9:1 on white.
- **Hairline** (hairline): every 1px pane border and row divider, plus the 2px resting border on pills and person buttons.
- **Field Stroke** (field-stroke): the darker 1px border on text inputs, selects, and textareas, and the scrollbar thumb.
- **Hover Wash** (hover-wash): hover background on rows, rail items, folders, and default buttons.

Identity colours: each person keeps one avatar colour everywhere, picked by hashing their id over six hues (#0b6476, #6a3d9a, #a8431b, #1d56b3, #2b6e2f, #8a3471), always with white initials. A missing person falls back to Slate. The logo's gold bar (#e8a317) appears only in the logo.

### Named Rules
**The Status Owns Saturation Rule.** Only the four status tones and the avatar hues are fully saturated. Chrome stays teal and grey, so a coloured badge is always news.

**The Never Colour Alone Rule.** Every status badge, chip, and notice pairs its tone with a drawn SVG icon and a word. A badge without an icon is broken.

## Typography

**Display Font:** Segoe UI Variable Text (with Segoe UI, system-ui, -apple-system, Noto Sans, sans-serif)
**Body Font:** the same stack

**Character:** one familiar office sans in several weights, Outlook's own voice. Hierarchy comes from size and weight (400 to 800), never from a second family.

### Hierarchy
The ramp runs in rem steps over the fluid root: 0.9, 1, 1.1, 1.15, 1.2, 1.3, 1.4, 1.6, 1.8.

- **Display** (700, 1.8rem, 1.15, -0.01em, balanced wrap): page and pane headings, such as the message subject in the reading pane or "Ingresar a la intranet".
- **Headline Large** (600, 1.6rem): document text (40ch max) and the initials on the 5rem login avatar.
- **Headline** (700, 1.4rem): the big outcome notice and record codes in the large list rows.
- **Title Large** (700, 1.3rem): person names on the login buttons.
- **Title** (700, 1.2rem): section headings (Estado de entrega, Documentos), names in outcome rows, the brand name, the app name in the bar, and the empty-reading-pane prompt.
- **Body Reading** (400 to 600, 1.15rem): the message body (60ch max, keeps its own line breaks), outcome badges, and assistant reply bubbles.
- **Body Lead** (600, 1.1rem): notices, empty states, the sender name in the message header, Asistente question buttons, the textarea, and initials on 3.4rem avatars.
- **Body** (400, 1rem = the root): the default for everything. Outcome badges also drop to 1rem in the narrowest container (under 26rem), where they may wrap.
- **Label** (600 to 700, 0.9rem): timestamps, previews, counts, tags, small badges, rail labels, attachment names, failure reasons, and default avatar initials. This is the floor.

Unread rows bump the sender and subject to 800. Timestamps use tabular numerals.

### Named Rules
**The 18px Floor Rule.** Nothing renders below 0.9rem, which is 18px at the smallest root and grows with it. A smaller size means the content should be cut, not shrunk.

## Layout

The app bar is sticky at 4.5rem. Under it the shell is a two-column grid: a sticky 7rem icon rail, then the content. Ordinary pages sit in a 76rem-max column with 2rem / 2.5rem padding and 1.5rem gaps between panes. Inside a pane, padding is 1.5rem / 1.75rem with 1.25rem gaps.

Correo fills the viewport height as three panes that each scroll on their own: a 13rem folder column, a message list of minmax(18rem, 30vw), and the reading pane. Pane headers stick to the top with a hairline beneath them. Without a list the mailbox drops to two columns. At 1440px or narrower, opening a message works like Outlook on a narrow screen. The folder column collapses to a 5.5rem icon strip: labels are visually hidden, Redactar becomes an icon-only primary button, and counts stay beside the icons. The list narrows to minmax(16rem, 28vw) and stays beside the reading pane. Below 1100px the panes stack and the folders become a wrapping row. Below 760px the rail shrinks to 4.5rem icons only, and the bar drops the name text.

Delivery outcome rows use a four-column grid (person, badge, review text, actions). A container query collapses them to two columns under 60rem and to one under 26rem. The Asistente splits 3:2. Login centres a 52rem form directly on the Office Ground, with no surrounding pane. The bordered person buttons, auto-fit at a 20rem minimum, are the only cards.

Spacing moves in rem steps of 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, and 2.5. Row padding is 1rem / 1.5rem, and large list rows use 1.25rem / 1.75rem.

## Elevation & Depth

Fully flat. No element has a box-shadow. Separation comes from three things: white panes on the grey Office Ground, 1px Hairline borders and dividers, and tonal washes for hover, selection, and status (Hover Wash, Selection Wash, and the 6 to 9% status tints). The sticky app bar and pane headers stay in place by stacking order alone.

### Named Rules
**The Hairline Not Shadow Rule.** Panes separate with a 1px Hairline and a white-on-grey step, never with a shadow.

## Shapes

Gently rounded, with radius growing by element size: image thumbnails inside attachment tiles at 0.3rem, tags at 0.35rem, buttons, fields and folder items at 0.45rem, rail items and attachment tiles at 0.5rem, and panes, notices, outcome rows and person buttons at 0.6rem. Folder counts use a soft 1rem round. Status badges are pills at 2rem, and the taller recipient pills use 2.5rem. Avatars are circles. The one asymmetric shape is the assistant reply bubble: 0.2rem nib top-left and 1rem elsewhere, the familiar chat speech shape.

Icons are line SVGs on a 24-unit grid with a 2px round-capped stroke in currentColor, sized 1.2em by default, 1.8rem in the rail, 2.4rem as list leads, and 5rem (1.25 stroke) in the empty reading pane.

## Components

### Buttons
Plain, solid office controls.
- **Shape:** gently rounded (0.45rem), at least 3rem tall, 600 weight, icon-and-label with a 0.55rem gap.
- **Primary:** Working Teal fill with white text, hovering to Pressed Teal. Use it for the one forward action: Redactar, Enviar, Liberar.
- **Default:** Pane White with a Hairline border and Ink text, hovering to Hover Wash. Use it for Descartar, Reintentar, Volver, and Abrir PDF.
- **On the app bar:** transparent with a 50%-white border, hovering to 14% white (Salir).
- **Focus:** a 3px Working Teal outline at a 2px offset everywhere.
- **Ask button (Asistente):** a full-width default button, 3.8rem tall, 1.1rem left-aligned text, with a teal chat icon.

### Status badges and chips
Solid pills filled with one status tone, white bold text, and an icon before the word. The full size (1.15rem in outcome rows) carries the delivery verdict. The small size (0.9rem) appears as chips under list rows, reading "Name · Estado" in sent and held folders and showing the review note in the inbox. The badge word gives the delivery answer (Entregado / En espera / No entregado). The neighbouring review text says who decided (Aprobado por mosAIc, Reparado por mosAIc, Liberado por Legal...).

### Delivery outcome rows (signature)
These sit at the top of the reading pane under "Estado de entrega": one full-width row per recipient, with a 0.6rem radius, a Hairline border, and a 6% tint of the row's status tone. The row holds an avatar and 1.2rem bold name, the large badge, the review text (with a muted reason under failures), and inline actions (Liberar primary with Descartar for Legal, Reintentar for the sender). Each row rises 1rem over 0.6s, staggered by 140ms. Its badge settles from 1.35x scale over 0.7s, 120ms after its row, on the expo-out ease. The scale is anchored to the edge the badge sits against: left in the four-column and one-column layouts, right in the two-column layout where the badge sits at the row's right end.

### Notices
These are status lines: an icon at 1.6em, 1.1rem 600 text in the full tone, a 2px border in the tone, and a 9% tinted fill. The big variant (1.4rem) announces the assistant outcome and uses the same rise-and-settle motion. Icons map check to ok, wrench to repaired, shield to waiting, and alert to failed.

### Cards / Containers
- **Corner Style:** 0.6rem.
- **Background:** Pane White on Office Ground.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Hairline.
- **Internal Padding:** 1.5rem / 1.75rem.

### Inputs / Fields
- **Style:** Pane White fill, a 1px Field Stroke border, 0.45rem radius, at least 3rem tall. Compose fields sit in a 9rem label column, with labels in Slate at 600.
- **Focus:** the global 3px Working Teal outline.
- **Attach files:** the native file input is visually hidden inside a default button labelled "Adjuntar archivos" with a paperclip icon. The chosen file names appear beside it in Slate, and the focus ring draws on the button.
- **Recipient pills:** a 2.5rem-round pill with a 2px Hairline border, an avatar, and a name. When checked it turns to a Working Teal border and Teal Wash fill, and a teal check appears. The real checkbox is visually hidden, and its focus ring draws on the pill.

### Navigation
- **App bar:** Deep Teal, holding the logo tile, AlphaCorp wordmark (1.2rem 700), a divider, the current app name (1.2rem 600), and on the right a large avatar, the person's name with their area, and Salir.
- **Icon rail:** a 1.8rem icon stacked over a 0.9rem 600 label in Slate. Hover shows Hover Wash. The active app gets Teal Wash with Working Teal text.
- **Folders:** Redactar sits as the primary button at the top. Folder links show an icon, a label, and a right-aligned teal count pill. The active folder gets Selection Wash with Working Teal text.

Accessible-only headings and native inputs use the visually-hidden utility (1px clip). The Asistente page keeps its h1 for screen readers only, and the collapsed folder strip keeps its labels the same way.

### Message rows
Each row is an avatar plus a stack: sender with a right-aligned muted time, then the subject with a paperclip when files are attached, then a muted one-line preview, all ellipsised. Rows are divided by Hairlines. Hover shows Hover Wash, and the selected row shows Selection Wash. Unread rows get an 800 weight and a 0.6rem Working Teal dot before the sender.

### Avatars
White initials on a circle in the person's identity colour, at 2.6rem by default, 3.4rem in the app bar and message header, and 5rem on login.

## Do's and Don'ts

### Do:
- **Do** size everything in rem on the fluid 20px-to-26px root, and keep every text at 0.9rem or larger.
- **Do** pair every status tone with its drawn SVG icon and a word, in a solid pill with white bold text.
- **Do** use Working Teal for exactly the forward action in a group, and default buttons for everything else.
- **Do** separate surfaces with 1px Hairline borders and the white-on-grey step.
- **Do** keep each person's avatar colour identical everywhere they appear.
- **Do** keep motion to the outcome rise-and-settle and 0.2s colour fades, and stop it all under `prefers-reduced-motion`.

### Don't:
- **Don't** add box-shadows. The system is flat.
- **Don't** hardcode colours outside the tokens; every colour must have a dark counterpart in the `prefers-color-scheme: dark` block.
- **Don't** use the status tones for decoration or chrome.
- **Don't** introduce a second typeface or a themed costume look. The world is the familiar office suite.
- **Don't** animate anything except state arrivals.
