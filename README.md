# AlphaCorp Intranet

Intranet empresarial ficticia (MVC) para probar [mosAIc](https://github.com/platanus-hack/platanus-hack-26-cl-team-24). Reproduce el caso clásico de ejemplo de mosAIc (`examples/policy.yaml`, `case.yaml` e `history.yaml`: organización `alphacorp`, operación `atlas`).

- `apps/intranet`: Express 5. `models/` (SQLite en memoria con `node:sqlite`), `controllers/`, `views/` (plantillas en JS que escapan todo).
- `packages/mosaic-client`: cliente de la API HTTP de mosAIc.
- `packages/mail-engine`: motor de correos mock. Cada entrega pasa por mosAIc antes de llegar al destinatario.

## Qué hace con mosAIc

- **La identidad es de la intranet.** El usuario de la sesión fija el rol que recibe mosAIc. El login es una cookie sin firmar: solo sirve para el mock.
- **Evidencia.** Abrir un documento envía una observación `read` a `POST /v1/observations` antes de mostrar el texto. Si mosAIc no responde, el documento no se muestra.
- **Correo** (`/correo`). Un humano redacta un correo que responde a una tarea del caso (`due`, `signature` o `record`). Puede adjuntar imágenes, PDF o audio: hasta 4 archivos y 4 MB en total, porque Vercel corta el body en unos 4,5 MB. El motor llama a `POST /v1/messages` una vez por destinatario con `request_id = <correo>:<destinatario>`:
  - `allow`: entrega el original con sus archivos.
  - `repair`: entrega el texto reparado. Si el correo trae adjuntos, queda retenido.
  - `review`: retiene el correo.
  - Si mosAIc falla, no entrega nada y el remitente puede reintentar.
  - El remitente ve el estado de cada destinatario. Legal (`senior_legal`) ve los retenidos y puede liberarlos o descartarlos. Antes de entregar uno liberado, el motor envía el cuerpo a `POST /v1/sources` para que mosAIc sepa lo que ahora conoce el destinatario. Los adjuntos liberados no se observan, porque `/v1/sources` solo acepta texto.
  - Para los adjuntos, mosAIc necesita el PR «Admite adjuntos de imagen, PDF y audio en los mensajes» y su clave de Claude (y `ELEVENLABS_API_KEY` para audio). Sin eso, un correo con adjuntos queda como no entregado. Los correos sin adjuntos funcionan con cualquier versión de mosAIc.
  - `/v1/messages` guarda cada entrega en la bandeja de mosAIc, así que los correos entregados también aparecen en la pantalla del Asistente del destinatario.
- **Asistente.** El agente redacta un borrador con las cláusulas del caso y lo envía a `POST /v1/messages`. El usuario solo ve su bandeja (`GET /v1/inbox/{user}`), nunca el borrador.

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

## Vercel

Crea un proyecto con **Root Directory** `apps/intranet` y define `MOSAIC_URL` con la URL pública de la API de mosAIc. Vercel sirve el `export default` de `app.js`. La base vive en memoria y se reinicia en cada arranque en frío. Para persistir hay que cambiarla por Turso/libSQL.
