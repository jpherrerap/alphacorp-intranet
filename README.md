# AlphaCorp Intranet

Intranet empresarial ficticia (MVC) para probar [mosAIc](https://github.com/platanus-hack/platanus-hack-26-cl-team-24). Reproduce el caso clásico de ejemplo de mosAIc (`examples/policy.yaml`, `case.yaml` e `history.yaml`: organización `alphacorp`, operación `atlas`).

- `apps/intranet`: Express 5. `models/` (SQLite en memoria con `node:sqlite`), `controllers/`, `views/` (plantillas en JS que escapan todo).
- `packages/mosaic-client`: cliente de la API HTTP de mosAIc.
- `packages/mail-engine`: motor de correos. Cada entrega pasa por mosAIc antes de llegar al destinatario. Con `MAIL_TRANSPORT=resend`, lo aprobado se copia además a una casilla real (ver «Correo real»).

## Qué hace con mosAIc

- **La identidad es de la intranet.** La intranet envía a mosAIc solo el id del usuario (`user`); mosAIc resuelve el rol en su propio `case.yaml` (`assignments`), así que los usuarios de `models/db.js` deben existir allí. El login es una cookie sin firmar: solo sirve para el mock.
- **Evidencia.** Abrir un documento envía una observación `read` a `POST /v1/observations` antes de mostrar el texto. Si mosAIc no responde, el documento no se muestra. Sin `MOSAIC_URL` (modo desarrollo), los documentos se muestran sin registrar la observación y el correo y el asistente quedan desactivados.
- **Correo** (`/correo`). AlphaCorp Mail tiene las carpetas Recibidos (con no leídos), Enviados y Retenidos, que solo ve Legal. Al redactar, el usuario elige Para, Asunto y una Clasificación, que es la tarea del caso (`due`, `signature` o `record`). Puede adjuntar imágenes, PDF o audio: hasta 4 archivos y 4 MB en total, porque Vercel corta el body en unos 4,5 MB. mosAIc revisa el asunto y el texto como un solo borrador (`Asunto: …\n\n<cuerpo>`). Un correo humano no responde una tarea del caso, así que el motor llama a `POST /v1/reviews` con la tarea `email`, una vez por destinatario y con `review_id = <correo>_<destinatario>`. En ese modo mosAIc lee el texto libre con Claude y decide solo por riesgo de inferencia: deja pasar lo sano aunque no use el vocabulario del caso y retiene lo que permite deducir un secreto, aunque esté parafraseado. La Clasificación queda solo en la intranet. Enviados muestra, por destinatario, el Envío (si llegó) y la Revisión (quién decidió y qué). Las bandejas parten con unos correos de ejemplo neutros que no pasaron por mosAIc y que se marcan como «previo a mosAIc».
  - `approved`: el motor confirma con `POST /v1/reviews/{id}/deliver`. Con `allow` entrega el original con sus archivos; con `repair` entrega el asunto y el texto reparados, sin adjuntos (un `repair` sin texto queda retenido). Si al confirmar mosAIc pide reevaluar, queda retenido. Un reintento sobre una entrega que mosAIc ya confirmó reproduce la decisión guardada.
  - `revise` (riesgo de inferencia) o `rejected` (adjunto no evaluable): retiene el correo.
  - Si mosAIc falla, no entrega nada y el remitente puede reintentar.
  - El remitente ve el estado de cada destinatario. Legal (`senior_legal`) ve los retenidos con el motivo y puede liberarlos o descartarlos. Antes de entregar uno liberado, el motor envía el cuerpo a `POST /v1/sources` para que mosAIc sepa lo que ahora conoce el destinatario. Los adjuntos liberados no se observan, porque `/v1/sources` solo acepta texto.
  - Requiere la clave de Claude en mosAIc (y `ELEVENLABS_API_KEY` para audio). Sin ella, `/v1/reviews` no puede analizar el texto y el correo queda como no entregado.
- **Asistente.** El agente redacta un borrador con las cláusulas del caso y lo envía a `POST /v1/messages`. El usuario solo ve su bandeja (`GET /v1/inbox/{user}`), nunca el borrador.
- **Adjuntos.** «¿Me mandas el acta de O-17?» envía un texto inocente con el escaneo del acta adjunto. mosAIc lo transcribe con Claude (imágenes y PDF) o con ElevenLabs (audio, requiere `ELEVENLABS_API_KEY` en mosAIc) y, como un adjunto no se puede reescribir, si filtra algo la respuesta queda en revisión.

## Ejecutar

Requiere Node 22.

```bash
npm install
npm test                      # no requiere mosAIc
# en otra terminal, desde el repo de mosAIc (fija el caso clásico; el valor por defecto es el MVP):
#   MOSAIC_POLICY=examples/policy.yaml MOSAIC_CASE=examples/case.yaml MOSAIC_HISTORY=examples/history.yaml \
#   python -m uvicorn isde.api:create_app --factory --port 8001
MOSAIC_URL=http://127.0.0.1:8001 npm run dev   # http://localhost:3000
```

Guion: Inés abre el acta de O-17. Ana y Luis preguntan «¿Cuándo vence el trámite?». Ana recibe la respuesta completa. Luis ya citó el acta, así que su respuesta se repara si mosAIc tiene clave de Claude y, sin clave, queda en revisión. Después, «¿En qué estado está O-17?» llega a Luis y queda en revisión para Ana.

## Correo real

Por defecto (`MAIL_TRANSPORT=mock`) los correos solo existen en las bandejas de la intranet. Con `MAIL_TRANSPORT=resend`, cada entrega que mosAIc aprueba o repara, o que Legal libera, se copia también a **una sola casilla** (`MAIL_TO`) con el destinatario en el asunto (`[luis] Plazo`) y el estado al pie. La copia lleva exactamente lo que ve el destinatario: el texto reparado si hubo `repair`, y nada si quedó retenido. No hay dominio verificado, así que Resend solo entrega a la dirección dueña de la cuenta; por eso `MAIL_TO` admite una única dirección y nadie real recibe correos de la demo. Si la copia falla, se registra en el log y la entrega en la intranet no cambia.

| Variable | Uso | Defecto |
|---|---|---|
| `MOSAIC_URL` | URL base de la API de mosAIc | sin valor: correo y asistente desactivados |
| `MAIL_TRANSPORT` | `mock` o `resend` | `mock` |
| `MAIL_TO` | casilla única que recibe las copias (la de la cuenta de Resend) | requerida con `resend` |
| `RESEND_API_KEY` | clave de Resend; solo en el entorno, nunca en el repo | requerida con `resend` |
| `MAIL_FROM` | remitente | `AlphaCorp Mail <onboarding@resend.dev>` |
| `PORT` | puerto local | `3000` |

En local, `npm run dev` lee `apps/intranet/.env` si existe (ignorado por git).

## Vercel

Crea un proyecto con **Root Directory** `apps/intranet` y define `MOSAIC_URL` con la URL pública de la API de mosAIc (y las variables de «Correo real» si quieres copias). mosAIc debe arrancar con el caso clásico (`MOSAIC_POLICY/CASE/HISTORY=examples/...`); con el perfil MVP por defecto, `ana`, `luis`, etc. no existen y todo responde 400. Vercel sirve el `export default` de `app.js`. La base vive en memoria **por instancia**: se reinicia en cada arranque en frío y dos peticiones atendidas por instancias distintas pueden no ver los mismos correos. Calienta la instancia antes de presentar. Para persistir hay que cambiarla por Turso/libSQL.
