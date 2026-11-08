const fs = require("node:fs");
const path = require("node:path");
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Cargar variables desde la raíz del proyecto.
// En Hostinger se utilizan las variables del entorno.
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// Validar la URL de PostgreSQL.
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL es obligatorio. Configura .env o las variables de Hostinger."
  );
}

// Validar JWT_SECRET en producción.
if (
  process.env.NODE_ENV === "production" &&
  (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
) {
  throw new Error(
    "JWT_SECRET debe tener al menos 32 caracteres en producción."
  );
}

// Evitar parámetros que puedan sobrescribir
// la configuración SSL de node-postgres.
const databaseUrl = new URL(process.env.DATABASE_URL);

for (const parameter of [
  "sslmode",
  "sslrootcert",
  "sslcert",
  "sslkey"
]) {
  if (databaseUrl.searchParams.has(parameter)) {
    throw new Error(
      `Elimina ${parameter} de DATABASE_URL y configura SSL desde db.js.`
    );
  }
}

// Configuración TLS para Supabase.
const sslEnabled = process.env.DATABASE_SSL === "true";

let ssl = false;

if (sslEnabled) {
  const defaultCaPath = path.resolve(
    __dirname,
    "../certs/prod-ca-2021.crt"
  );

  const caPath = process.env.DATABASE_CA_PATH
    ? path.resolve(process.env.DATABASE_CA_PATH)
    : defaultCaPath;

  const ca = process.env.DATABASE_CA_CERT
    ? process.env.DATABASE_CA_CERT.replace(/\\n/g, "\n")
    : fs.readFileSync(caPath, "utf8");

  if (!ca.includes("-----BEGIN CERTIFICATE-----")) {
    throw new Error(
      "El certificado CA de PostgreSQL no tiene un formato PEM válido."
    );
  }

  ssl = {
    ca,
    rejectUnauthorized: true,
    minVersion: "TLSv1.2"
  };
}

// Crear pool de conexiones PostgreSQL.
const pool = new Pool({
  connectionString: databaseUrl.toString(),
  ssl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// Detectar errores en conexiones inactivas.
pool.on("error", (error) => {
  console.error(
    "Error en el pool de PostgreSQL:",
    error.message
  );
});

// Exportar pool para las rutas de Express.
module.exports = { pool };
