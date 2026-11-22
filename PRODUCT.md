# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A live demo audience, such as judges or viewers, watching a presenter run the AlphaCorp script on a projector. They do not use the intranet themselves. Their job is to understand, from across a room and in seconds, that mosAIc stopped a secret from reaching the wrong person.

The presenter drives the UI and switches between four seeded people: Ana Rojas and Luis Pérez (Ventas, `vendor`), Sofía Mena (Legal, `senior_legal`) and Inés Soto (Compras, `procurement`).

## Product Purpose

AlphaCorp Intranet is a fictional company intranet. It exists to demo and test [mosAIc](https://github.com/platanus-hack/platanus-hack-26-cl-team-24) on mosAIc's classic example case (organization `alphacorp`, operation `atlas`, record O-17). The demo works when the audience can see who knows what, what each person asked or sent, and what mosAIc did about it.

## Operating Context

- Shown on a projector during a scripted demo: Inés opens the O-17 signature record. Ana and Luis ask «¿Cuándo vence el trámite?». Ana gets the full answer. Luis's answer is repaired, or held for review when mosAIc has no Claude key. Then «¿En qué estado está O-17?» reaches Luis and is held for review for Ana.
- Mail (`/correo`): Recibidos, Enviados, and Retenidos (only Legal sees Retenidos). The sender picks a Clasificación (`due`, `signature`, `record`). Each recipient has a delivery status. Legal can release or discard held mail.
- Assistant: the agent drafts a reply and sends it to mosAIc. The user sees only their inbox, never the draft.
- Attachments: images, PDF, or audio. At most 4 files and 4 MB in total, because of Vercel's body limit.

## Capabilities and Constraints

- Express 5, server-rendered views in JS templates that escape everything, in-memory SQLite (`node:sqlite`) reseeded on every cold start, deployed on Vercel from `apps/intranet`.
- Identity belongs to the intranet. The login is an unsigned cookie that only serves the mock.
- A document is shown only after mosAIc acknowledges the `read` observation. If mosAIc fails, nothing is shown or delivered.
- mosAIc outcomes the UI must express: `approved` (delivered), `revise` or `rejected` (held), repaired answer, mosAIc unavailable (not delivered, sender can retry), and «previo a mosAIc» for seeded mail.
- `packages/mail-engine` and `packages/mosaic-client` are libraries with no UI.

## Brand Commitments

- All UI copy is in Spanish.
- Binding brief from the owner: a frontend for a projector. Use very little text. Do not use small text. Use large shapes, strong contrast, and clear motion.
- It must look like real intranet software, with a familiar Outlook-style mailbox, adapted for the projector, not the other way around (owner's steer, 2026-11-22). No themed or costume looks.
- AlphaCorp is fictional and must stay that way.

## Evidence on Hand

- Seed data in `apps/intranet/models/db.js` (the four users, record O-17, two documents) and seed mail in the mail engine.
- Scan of the signature record: `apps/intranet/assets/acta-o17.png`.
- The demo script in `README.md`.
- There are no real customers, metrics, or testimonials. Do not invent any.

## Product Principles

1. Readable from the back of the room. If it does not read on a projector, it does not ship.
2. The outcome is the headline. What mosAIc decided for each person is the thing the audience must see.
3. One idea per screen moment. Cut text the presenter can say out loud.
4. Truthful states. Never show delivered when a delivery is held, unknown, or failed.

## Accessibility & Inclusion

Projector viewing sets the bar: large type, high contrast that survives washed-out projection, and status that never depends on color alone. Motion must explain a state change and respect `prefers-reduced-motion`.
