<div align="center">

# 🏢 Sistema Atlas

### Plataforma web para la gestión de empresas, clientes y contratos

**React · Vite · Material UI · Express · PostgreSQL · Supabase · Swagger · Hostinger**

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?logo=postgresql&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger&logoColor=black) ![Hostinger](https://img.shields.io/badge/Hostinger-Deploy-673DE6?logo=hostinger&logoColor=white)

</div>

---

## 📖 Descripción

**Sistema Atlas** es una aplicación web full stack para administrar empresas, usuarios y roles, clientes, contratos, documentos asociados y auditoría de actividades. Su panel permite visualizar indicadores de clientes y contratos próximos a vencer.

## ✨ Funcionalidades

| Módulo | Descripción |
|---|---|
| 🔐 Autenticación | Login con JWT y roles |
| 🏢 Empresas | Información comercial y configuración |
| 👥 Usuarios y roles | Gestión de cuentas y asociaciones con empresas |
| 🧑‍💼 Clientes | Registro y administración de clientes |
| 📑 Contratos | CRUD de contratos y fechas de vencimiento |
| 📈 Dashboard | Indicadores de usuarios, clientes y vencimientos |
| 🕒 Auditoría | Historial de actividad |
| 📘 API REST | Documentación interactiva mediante Swagger / OpenAPI |
| 📱 Responsive | Menú móvil, tarjetas fluidas y formularios adaptativos |

## 🏗️ Arquitectura

```text
Navegador (React + Vite + Material UI)
           │ HTTPS (mismo origen)
           ▼
Hostinger: Node.js / Express
  ├── API REST y autenticación JWT
  ├── Swagger /docs
  └── frontend compilado FRONTEND/dist
           │ PostgreSQL + TLS
           ▼
Supabase: PostgreSQL administrado
```

## 📁 Estructura

```text
Sistema-Atlas/
├── BACKEND/
│   ├── sql/init.sql          # Estructura inicial (sin datos reales)
│   ├── src/app.js            # Servidor Express, API y React SPA
│   ├── src/db.js             # Pool PostgreSQL y TLS
│   ├── src/openapi.json      # Especificación OpenAPI
│   └── src/routes/          # Rutas REST
├── FRONTEND/
│   ├── src/pages/           # Pantallas
│   ├── src/components/      # Layout y navegación responsive
│   └── src/lib/api.jsx      # Cliente Axios
├── .env.example
├── .gitignore
└── package.json             # Instalación, compilación y arranque
```

## 🧰 Requisitos

- Node.js **22–24** y npm
- PostgreSQL local o base **Supabase PostgreSQL**
- Git y VS Code (opcionales)

## 🚀 Desarrollo local (sin Docker)

```powershell
Copy-Item .env.example .env
npm install
npm run build
npm run dev
```

Personaliza el `.env` privado con `DATABASE_URL` y `JWT_SECRET`, y ejecuta `BACKEND/sql/init.sql` una sola vez en la base de datos correspondiente. El comando `npm install` prepara las dependencias del backend; `npm run build` instala las del frontend y genera `FRONTEND/dist`.

Para usar Vite con recarga rápida, abre **otra terminal**:

```powershell
npm run dev:frontend
```

Crea `FRONTEND/.env.local` con `VITE_API_URL=http://localhost:4450` para el modo de desarrollo Vite. En producción no la definas: la API se consulta desde el mismo dominio.

| Recurso | URL local |
|---|---|
| 🌐 Frontend integrado | http://localhost:4450/login |
| ⚡ Vite | http://localhost:3350/login |
| ✅ Estado API | http://localhost:4450/api/health |
| 🗄️ Estado de DB | http://localhost:4450/api/db-health |
| 📗 Swagger UI | http://localhost:4450/docs |
| 📄 OpenAPI JSON | http://localhost:4450/openapi.json |

## ☁️ Despliegue en Hostinger + GitHub

1. Publica este repositorio en GitHub **sin** archivos `.env`, `node_modules` ni dumps de datos.
2. Crea un proyecto Supabase, abre **SQL Editor** e importa `BACKEND/sql/init.sql` (verifica tablas).
3. Para una conexión IPv4 de larga duración, elige **Session pooler** y copia la cadena PostgreSQL completa de Supabase, reemplazando `[PASSWORD]` sin corchetes.
4. En Hostinger conecta el repositorio GitHub y configura:

| Campo | Valor |
|---|---|
| Framework | `Other` |
| Branch | `main` |
| Node | `24.x` |
| Root directory | `./` |
| Build command | `npm run build` |
| Output directory | `FRONTEND/dist` |
| Entry file | `BACKEND/src/app.js` |

El script `build` instala Vite con `--include=dev` para evitar el error `vite: command not found` de builds en modo production.

### 🔐 Variables de entorno (en Hostinger)

| Variable | Ejemplo / función |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | PostgreSQL **Session pooler**, no localhost |
| `DATABASE_SSL` | `true` |
| `JWT_SECRET` | Cadena aleatoria privada de al menos 32 caracteres |
| `FRONTEND_URL` | `https://tu-subdominio` |
| `DATABASE_CA_CERT` | Certificado CA PEM (opcional, si requiere CA propia) |

Deja `PORT` sin definir si Hostinger lo asigna. Para SSL validado, proporciona una CA confiable si el certificado no es reconocido por Node. No uses `rejectUnauthorized: false`.

### 🛠️ Comprobación

Prueba `/api/health`, `/api/db-health`, `/docs`, `/login` y el registro con **datos ficticios**. Un resultado de `/api/health` correcto solo significa que Express responde; `/api/db-health` verifica la conexión SQL.

## ⚠️ Seguridad — antes de uso público

**Este repositorio proviene de una implementación académica con debilidades de seguridad conocidas.** No lo uses con información empresarial, contractual o personal real antes de corregir y auditar: hashing de contraseñas, permisos por empresa/rol, endpoints de lectura/escritura, protección de archivos, validación y secretos. El proyecto conserva rutas originales para facilitar la migración, pero **el despliegue no certifica seguridad de producción**. Los archivos subidos en almacenamiento local de Hostinger pueden perderse durante despliegues: migra documentos a almacenamiento privado persistente con controles de acceso.

## 📄 Documentación

OpenAPI: [`BACKEND/src/openapi.json`](BACKEND/src/openapi.json). Swagger UI: `/docs`.

## 🧪 Licencia y alcance

Proyecto de demostración y aprendizaje. Utiliza únicamente datos sintéticos para pruebas hasta completar las medidas de seguridad.
