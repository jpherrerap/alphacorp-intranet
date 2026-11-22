// Mirrors the vaccine scenario of mosAIc's panel (VX-Aurora, Biovacunas del Sur). Run mosAIc with
// MOSAIC_CASE=examples/vacuna-case.yaml and MOSAIC_HISTORY=examples/vacuna-history.yaml: that history holds this
// ontology and Luis's two earlier mails below, which the mosaic draft completes.
export const sql = `
  INSERT INTO users VALUES
    ('ana', 'Ana Rojas', 'comunicaciones', 'Comunicaciones'),
    ('luis', 'Luis Pérez', 'comunicaciones', 'Comunicaciones'),
    ('sofia', 'Sofía Mena', 'senior_legal', 'Legal'),
    ('ines', 'Inés Soto', 'investigacion', 'Ensayos clínicos');

  INSERT INTO records VALUES ('vxa', 'VX-Aurora', 'Ensayos clínicos de fase III', '30 de noviembre');

  INSERT INTO documents VALUES
    ('informe_vxa', 'vxa', 'Informe de ensayos', 'La vacuna VX-Aurora contra el virus respiratorio sincicial está en ensayos clínicos de fase III en curso, con 4.800 voluntarios en Chile y Perú. Los resultados preliminares muestran 91% de eficacia. La existencia de los ensayos no se ha anunciado y no debe comunicarse.',
     'simulacion_vacuna', NULL, 'investigacion,senior_legal',
     '[["vx_aurora","es_un","vacuna"],["ensayos_vx_aurora","fase","fase_iii"],["ensayos_vx_aurora","eficacia_preliminar","eficacia_91_porciento"]]');
`;

// A human email answers no case task; the classification only stays in the intranet.
export const classifications = { prensa: 'Prensa · informe anual', ensayos: 'Ensayos · VX-Aurora' };

// The default mosAIc case has no tasks, so the assistant has nothing to answer here.
export const tasks = {};

export const mails = [
  { id: 'seed-viajes', sender: 'ines', to: ['luis'], task: 'general', at: '2026-11-05T13:20:00.000Z',
    subject: 'Viajes de diciembre',
    body: 'Luis, te paso las fechas: el equipo de Ensayos clínicos viaja a Lima y a Arica cada dos semanas hasta marzo para las visitas de control. ¿Me ayudas a reservar los vuelos?' },
  { id: 'seed-imprenta', sender: 'sofia', to: ['luis'], task: 'general', at: '2026-11-12T15:45:00.000Z',
    subject: 'Pedido a imprenta',
    body: 'Luis, imprenta necesita 4.800 copias del consentimiento informado, versión Chile y versión Perú. Cárgalo al centro de costo de Ensayos clínicos, no al de Comunicaciones.' },
  { id: 'seed-bienvenida', sender: 'sofia', to: ['ana', 'luis', 'ines'], task: 'general', at: '2026-11-17T12:10:00.000Z',
    subject: 'Bienvenida al cierre de año',
    body: 'Hola a todos:\n\nEmpieza la preparación del informe anual. Cualquier duda sobre lo que se puede publicar, escríbanle a Legal por este correo.\n\nSofía' },
  { id: 'seed-reunion', sender: 'ines', to: ['ana', 'luis'], task: 'general', at: '2026-11-18T14:30:00.000Z',
    subject: 'Reunión de seguimiento del lunes',
    body: 'Nos juntamos el lunes a las 10:00 en la sala Andes para revisar la agenda de la semana.' },
];

// Ready-to-send drafts. Two leak the trials: one names them outright; the other looks harmless alone and only
// reveals them to Luis, combined with the travel and printing mails he already got.
export const drafts = [
  { id: 'borrador-nota', sender: 'ana', to: ['luis'], task: 'prensa', at: '2026-11-21T13:00:00.000Z',
    subject: 'Datos para la nota de prensa',
    body: 'Luis, para la nota del informe anual: VX-Aurora ya está en fase III, con 4.800 voluntarios en Chile y Perú y 91% de eficacia preliminar. ¿Lo agregas al borrador?' },
  { id: 'borrador-informe', sender: 'ana', to: ['luis'], task: 'prensa', at: '2026-11-21T15:30:00.000Z',
    subject: 'Idea para el informe anual',
    body: 'Luis, para el informe anual se me ocurre un recuadro sobre el virus respiratorio sincicial y cómo llena las urgencias pediátricas cada invierno. Inés dice que en marzo quizás tengamos algo propio que contar, así que dejemos el espacio reservado.' },
  // Control: a harmless draft that mosAIc should deliver.
  { id: 'borrador-almuerzo', sender: 'ana', to: ['ines'], task: 'general', at: '2026-11-21T17:00:00.000Z',
    subject: 'Almuerzo',
    body: '¿Confirmas almuerzo mañana a las 13:00?' },
];
