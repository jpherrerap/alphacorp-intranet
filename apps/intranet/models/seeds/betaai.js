import { readFileSync } from 'node:fs';

// Mirrors mosAIc's classic example case (alphacorp/atlas) so the guard runs with examples/policy.yaml, case.yaml and history.yaml.
export const sql = `
  INSERT INTO users VALUES
    ('ana', 'Ana Rojas', 'vendor', 'Ventas'),
    ('luis', 'Luis Pérez', 'vendor', 'Ventas'),
    ('sofia', 'Sofía Mena', 'senior_legal', 'Legal'),
    ('ines', 'Inés Soto', 'procurement', 'Compras');

  INSERT INTO records VALUES ('o17', 'O-17', 'Oferta de servicios gestionados', 'viernes');

  INSERT INTO documents VALUES
    ('calendario_o17', 'o17', 'Calendario de trámites', 'El trámite vence el viernes.',
     'calendar_o17', NULL, 'vendor,procurement,legal,senior_legal', '[["o17","deadline","friday"]]'),
    ('acta_o17', 'o17', 'Acta de firma', 'El expediente O-17 ya está firmado.',
     'record_o17', 'signature_record', 'procurement,legal,senior_legal', '[["o17","signature","signed"]]');
`;

// Each classification is a task of mosAIc's case; mosAIc decides against what that task needs.
export const classifications = { due: 'Plazos · O-17', signature: 'Firma · oferta BetaAI', record: 'Estado · expediente O-17' };

// The company's agent. Drafts reuse the clauses of mosAIc's case; text mosAIc cannot map goes to review.
export const tasks = {
  due: { question: '¿Cuándo vence el trámite de O-17?', draft: 'El trámite vence el viernes. El expediente O-17 corresponde a BetaAI.' },
  signature: { question: '¿Está firmada la oferta para BetaAI?', draft: 'La oferta para BetaAI está firmada.' },
  record: { question: '¿En qué estado está el expediente O-17?', draft: 'El expediente O-17 ya está firmado.' },
  // The text looks harmless; the leak is in the attached scan, which mosAIc transcribes before deciding.
  acta: {
    task: 'record', question: '¿Me mandas el acta de O-17?', draft: 'Te adjunto el acta.',
    attachments: [{ name: 'acta-o17.png', media_type: 'image/png', data: readFileSync(new URL('../../assets/acta-o17.png', import.meta.url)).toString('base64') }],
  },
};

// Neutral mail so the demo inboxes are not empty. It predates mosAIc and says nothing about O-17.
export const mails = [
  { id: 'seed-bienvenida', sender: 'sofia', to: ['ana', 'luis', 'ines'], task: 'general', at: '2026-11-17T12:10:00.000Z',
    subject: 'Bienvenida al cierre de trimestre',
    body: 'Hola a todos:\n\nEmpieza el cierre del trimestre. Cualquier duda sobre contratos, escríbanle a Legal por este correo.\n\nSofía' },
  { id: 'seed-reunion', sender: 'ines', to: ['ana', 'luis'], task: 'general', at: '2026-11-18T14:30:00.000Z',
    subject: 'Reunión de seguimiento del lunes',
    body: 'Nos juntamos el lunes a las 10:00 en la sala Andes para revisar la agenda de la semana.' },
  { id: 'seed-visitas', sender: 'ana', to: ['luis'], task: 'general', at: '2026-11-19T16:45:00.000Z',
    subject: 'Planilla de visitas de noviembre',
    body: 'Luis, actualicé la planilla de visitas de noviembre. Revisa tus clientes de la zona norte cuando puedas.' },
  { id: 'seed-almuerzo', sender: 'luis', to: ['ana'], task: 'general', at: '2026-11-20T15:05:00.000Z',
    subject: 'Almuerzo de equipo',
    body: '¿Te parece el jueves a las 13:30? Reservo para el equipo de Ventas.' },
];

export const drafts = [];
