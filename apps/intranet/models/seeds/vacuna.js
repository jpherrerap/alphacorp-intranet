// Mirrors the vaccine scenario of mosAIc's panel (VX-Aurora, Biovacunas del Sur). Run mosAIc with
// MOSAIC_CASE=examples/vacuna-case.yaml: its default policy and history already hold this ontology.
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
  { id: 'seed-bienvenida', sender: 'sofia', to: ['ana', 'luis', 'ines'], task: 'general', at: '2026-11-17T12:10:00.000Z',
    subject: 'Bienvenida al cierre de año',
    body: 'Hola a todos:\n\nEmpieza la preparación del informe anual. Cualquier duda sobre lo que se puede publicar, escríbanle a Legal por este correo.\n\nSofía' },
  { id: 'seed-reunion', sender: 'ines', to: ['ana', 'luis'], task: 'general', at: '2026-11-18T14:30:00.000Z',
    subject: 'Reunión de seguimiento del lunes',
    body: 'Nos juntamos el lunes a las 10:00 en la sala Andes para revisar la agenda de la semana.' },
];

// Ready-to-send drafts that leak the trials: one names them outright, the other paraphrases them.
export const drafts = [
  { id: 'borrador-nota', sender: 'ana', to: ['luis'], task: 'prensa', at: '2026-11-21T13:00:00.000Z',
    subject: 'Datos para la nota de prensa',
    body: 'Luis, para la nota del informe anual: VX-Aurora ya está en fase III, con 4.800 voluntarios en Chile y Perú y 91% de eficacia preliminar. ¿Lo agregas al borrador?' },
  { id: 'borrador-rumor', sender: 'ana', to: ['luis'], task: 'ensayos', at: '2026-11-21T15:30:00.000Z',
    subject: 'Lo que se comenta en el laboratorio',
    body: 'Me contaron que en el laboratorio están probando en secreto una vacuna contra el virus sincicial con casi cinco mil personas de Chile y Perú, y que funciona en nueve de cada diez. No lo comentes todavía.' },
];
