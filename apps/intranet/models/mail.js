// Neutral mail so the demo inboxes are not empty. It predates mosAIc and says nothing about O-17.
export const SEED_MAILS = [
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
