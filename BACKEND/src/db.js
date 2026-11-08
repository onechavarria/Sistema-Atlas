const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL es obligatorio. Configura .env en la raíz o las variables de Hostinger.');
}
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en producción.');
}

let ssl = false;
if (process.env.DATABASE_SSL === 'true') {
  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, '\n') ||
    (process.env.DATABASE_CA_PATH ? fs.readFileSync(path.resolve(process.env.DATABASE_CA_PATH), 'utf8') : undefined);
  // Requiere CA pública del servidor para SSL verificable, nunca deshabilitar rejectUnauthorized.
  ssl = ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true };
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl });
module.exports = { pool };
