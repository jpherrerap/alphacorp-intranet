# AlphaCorp Intranet

Intranet empresarial ficticia (MVC) para probar [mosAIc](https://github.com/platanus-hack/platanus-hack-26-cl-team-24). Reproduce el caso clásico de ejemplo de mosAIc (`examples/policy.yaml`, `case.yaml` e `history.yaml`: organización `alphacorp`, operación `atlas`).

- `apps/intranet`: Express 5. `models/` (SQLite en memoria con `node:sqlite`, sembrada según `INTRANET_SEED`), `controllers/`, `views/` (plantillas en JS que escapan todo).
- `packages/mosaic-client`: cliente de la API HTTP de mosAIc.
- `packages/mail-engine`: motor de correos mock. Cada entrega pasa por mosAIc antes de llegar al destinatario.

## Qué hace con mosAIc

- **La identidad es de la intranet.** El usuario de la sesión fija el rol que recibe mosAIc. El login es una cookie sin firmar: solo sirve para el mock.
- **Evidencia.** Abrir un documento envía una observación `read` a `POST /v1/observations` antes de mostrar el texto. Si mosAIc no responde, el documento no se muestra.
- **Correo** (`/correo`). AlphaCorp Mail tiene las carpetas Recibidos (con no leídos), Enviados y Retenidos, que solo ve Legal. Al redactar, el usuario elige Para, Asunto y una Clasificación, que es la tarea del caso (`due`, `signature` o `record`). Puede adjuntar imágenes, PDF o audio: hasta 4 archivos y 4 MB en total, porque Vercel corta el body en unos 4,5 MB. mosAIc revisa el asunto y el texto como un solo borrador (`Asunto: …\n\n<cuerpo>`). Un correo humano no responde una tarea del caso, así que el motor llama a `POST /v1/reviews` con la tarea `email`, una vez por destinatario y con `review_id = <correo>_<destinatario>`. En ese modo mosAIc lee el texto libre con Claude y decide solo por riesgo de inferencia: deja pasar lo sano aunque no use el vocabulario del caso y retiene lo que permite deducir un secreto, aunque esté parafraseado. La Clasificación queda solo en la intranet. Enviados muestra, por destinatario, el Envío (si llegó) y la Revisión (quién decidió y qué). Las bandejas parten con unos correos de ejemplo neutros que no pasaron por mosAIc y que se marcan como «previo a mosAIc».
  - `approved`: el motor confirma con `POST /v1/reviews/{id}/deliver` y entrega el original con sus archivos. Si al confirmar mosAIc pide reevaluar, queda retenido.
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

### Casos (`INTRANET_SEED`)

`INTRANET_SEED` elige el caso que se siembra al arrancar (directorio, expedientes, correos y preguntas del asistente). Los datos están en `apps/intranet/models/seeds/`.

- `betaai` (por defecto): el caso clásico descrito arriba.
- `vacuna`: el escenario de la vacuna VX-Aurora de Biovacunas del Sur del panel de mosAIc, con los mismos nombres. Ana y Luis son de Comunicaciones, Inés es de Ensayos clínicos (lee el informe) y Sofía sigue en Legal. Luis ya recibió dos correos que parecen trámites: Inés le pide vuelos a Lima y Arica para las visitas de control de Ensayos clínicos hasta marzo, y Sofía, 4.800 copias del consentimiento informado para Chile y Perú. Ana tiene dos **Borradores** listos para Luis: «Datos para la nota de prensa» nombra los ensayos, y «Idea para el informe anual» (un recuadro sobre el VRS y «algo propio que contar» en marzo) parece inofensivo por sí solo, pero junto con esos dos correos revela los ensayos. mosAIc debería retener ambos. El asistente no tiene preguntas en este caso. mosAIc se arranca con la política por defecto, el caso `examples/vacuna-case.yaml`, que agrega a los cuatro usuarios, y el historial `examples/vacuna-history.yaml`, que trae la ontología y los dos correos que recibió Luis (usa una base nueva):

```bash
# en el repo de mosAIc
MOSAIC_CASE=examples/vacuna-case.yaml MOSAIC_HISTORY=examples/vacuna-history.yaml MOSAIC_API_DB=vacuna.sqlite \
  python -m uvicorn isde.api:create_app --factory --port 8001
# aquí
INTRANET_SEED=vacuna MOSAIC_URL=http://127.0.0.1:8001 npm run dev
```

Guion: Inés abre el acta de O-17. Ana y Luis preguntan «¿Cuándo vence el trámite?». Ana recibe la respuesta completa. Luis ya citó el acta, así que su respuesta se repara si mosAIc tiene clave de Claude y, sin clave, queda en revisión. Después, «¿En qué estado está O-17?» llega a Luis y queda en revisión para Ana.

## Vercel

Crea un proyecto con **Root Directory** `apps/intranet` y define `MOSAIC_URL` con la URL pública de la API de mosAIc. Vercel sirve el `export default` de `app.js`. La base vive en memoria y se reinicia en cada arranque en frío. Para persistir hay que cambiarla por Turso/libSQL.
