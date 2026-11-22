import * as betaai from './seeds/betaai.js';
import * as vacuna from './seeds/vacuna.js';

const SEEDS = { betaai, vacuna };
const name = process.env.INTRANET_SEED || 'betaai';
if (!Object.hasOwn(SEEDS, name)) throw new Error(`INTRANET_SEED desconocido: ${name}. Usa ${Object.keys(SEEDS).join(' o ')}.`);

// The demo case chosen at startup: directory, records, mail and the assistant's questions.
export const seed = SEEDS[name];
