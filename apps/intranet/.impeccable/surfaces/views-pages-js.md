---
version: 1
slug: "views-pages-js"
primary_target: "views/pages.js"
related_targets: []
---

# AlphaCorp Intranet (all routes)

Scope: the whole intranet shell, Expedientes, Asistente, Correo, login. Mode: Operate (presenter operates it; a projector audience watches).

Audience/job: a live room reads, from distance, who got what and what mosAIc decided. Presenter switches people and opens mail.
Constraints: Spanish copy; projector (very little text, no small text, large shapes, strong contrast, clear motion); must look like real intranet software, with an Outlook-style mailbox; adapt that for the projector, not the other way around.

## Direction contract

THESIS: Real Microsoft-365-class intranet software, enlarged for the back row. Refuses the 15px enterprise dashboard and refuses any themed costume.

OWN-WORLD: Light office ground (#eef1f4) under an AlphaCorp deep-teal app bar; white panes with hairline borders; Segoe UI where the presenter's OS has it, system sans (Noto) elsewhere; 20px base scaling to 26px on 1080p, nothing under 18px; solid status badges, each with its own drawn icon: green check Entregado, amber shield Retenido (held by the guard) and amber clock Consultando, red triangle No entregado (red x Descartado), blue wrench Reparado and blue unlock Liberado.

STORY: The audience sees whose screen it is (big avatar + name in the app bar), which app is open (left rail), and for every message, each recipient's outcome as a big badge. The presenter can log in as anyone in one click, ask the assistant, compose, release held mail.

FIRST VIEWPORT: Teal app bar (logo, app name, person). 7rem icon rail left, wide enough for its labels at projector size. Mail: folder pane (Redactar primary button, Recibidos/Enviados/Retenidos with counts), message list column, reading pane; opening a message keeps the list beside it; at 1440px and below the folder pane collapses to an icon strip, as in Outlook. Delivery outcomes are full-width recipient rows with large badges at the top of the reading pane's status block.

FORM: canon (standing exit taken by the user's steer: "real intranet software + a familiar outlook like interface"); seed: seed:7588097b47ca81a8. Signature move: delivery outcome rows that resolve one by one, each badge settling in with a short scale ease-out.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
