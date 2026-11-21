# AlphaCorp Intranet

Intranet empresarial ficticia (MVC) para probar [mosAIc](https://github.com/platanus-hack/platanus-hack-26-cl-team-24). Reproduce el caso de ejemplo de mosAIc (organización `alphacorp`, operación `atlas`), así que el guardrail corre con su política por defecto.

- `apps/intranet`: Express 5. `models/` (SQLite en memoria con `node:sqlite`), `controllers/`, `views/` (plantillas en JS que escapan todo).
- `packages/mosaic-client`: cliente de la API HTTP de mosAIc.

## Qué hace con mosAIc

- **La identidad es de la intranet.** El usuario de la sesión fija el rol que recibe mosAIc. El login es una cookie sin firmar: solo sirve para el mock.
- **Evidencia.** Abrir un documento envía una observación `read` a `POST /v1/observations` antes de mostrar el texto. Si mosAIc no responde, el documento no se muestra.
- **Asistente.** El agente redacta un borrador con las cláusulas del caso y lo envía a `POST /v1/messages`. El usuario solo ve su bandeja (`GET /v1/inbox/{user}`), nunca el borrador.
- **Adjuntos.** «¿Me mandas el acta de O-17?» envía un texto inocente con el escaneo del acta adjunto. mosAIc lo transcribe con Claude (imágenes y PDF) o con ElevenLabs (audio, requiere `ELEVENLABS_API_KEY` en mosAIc) y, como un adjunto no se puede reescribir, si filtra algo la respuesta queda en revisión.

## Ejecutar

Requiere Node 22.

```bash
npm install
npm test                      # no requiere mosAIc
# en otra terminal, desde el repo de mosAIc: python -m uvicorn isde.api:create_app --factory --port 8001
MOSAIC_URL=http://127.0.0.1:8001 npm run dev   # http://localhost:3000
```

Guion: Inés abre el acta de O-17. Ana y Luis preguntan «¿Cuándo vence el trámite?». Ana recibe la respuesta completa. Luis ya citó el acta, así que su respuesta se repara si mosAIc tiene clave de Claude y, sin clave, queda en revisión. Después, «¿En qué estado está O-17?» llega a Luis y queda en revisión para Ana.

## Vercel

Crea un proyecto con **Root Directory** `apps/intranet` y define `MOSAIC_URL` con la URL pública de la API de mosAIc. Vercel sirve el `export default` de `app.js`. La base vive en memoria y se reinicia en cada arranque en frío. Para persistir hay que cambiarla por Turso/libSQL.
