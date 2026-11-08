const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const { pool } = require("./db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const clientRoutes = require("./routes/clients");
const contractRoutes = require("./routes/contracts");
const auditRoutes = require("./routes/audit");
const empresasRoutes = require("./routes/empresas");
const rolesRoutes = require("./routes/roles");
const empresaUsuariosRoutes = require("./routes/empresa_usuarios");
const metricasRoutes = require("./routes/metricas");

const app = express();

const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({ origin: allowedOrigin ? allowedOrigin.split(',').map((s) => s.trim()) : true }));
app.use(express.json());
app.use(morgan("dev"));

const uploadsDir = path.join(__dirname, "..", "uploads", "contracts");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use("/autenticacion", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/clientes", clientRoutes);
app.use("/contratos", contractRoutes);
app.use("/auditoria", auditRoutes);
app.use("/empresas", empresasRoutes);
app.use("/roles", rolesRoutes);
app.use("/empresa-usuarios", empresaUsuariosRoutes);
app.use("/metricas", metricasRoutes);

const openapi = require("./openapi.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.get("/openapi.json", (req, res) => {
  res.json(openapi);
});

// No publicar documentos de contratos sin comprobar permisos por usuario.
// app.use('/files/contracts', express.static(uploadsDir));

app.get('/api/health', (_req, res) => res.json({ name: 'atlas', status: 'ok' }));
app.get('/api/db-health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ database: 'ok' }); }
  catch (err) { console.error('DB health failed:', err.code || err.message); res.status(503).json({ database: 'unavailable' }); }
});

const frontendDist = path.resolve(__dirname, '../../FRONTEND/dist');
const indexHtml = path.join(frontendDist, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendDist, { index: false }));
  app.get(/^(?!\/(?:api|docs|openapi\.json|autenticacion|usuarios|clientes|contratos|auditoria|empresas|roles|empresa-usuarios|metricas|files)\b).*/, (_req, res) => {
    res.sendFile(indexHtml);
  });
} else {
  app.get('/', (_req, res) => res.json({ name: 'atlas', status: 'ok', frontend: 'build required' }));
}

const PORT = Number(process.env.PORT) || 4450;
app.listen(PORT, '0.0.0.0', () => console.log(`Atlas API escuchando en puerto ${PORT}`));
