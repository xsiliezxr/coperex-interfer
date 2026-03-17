# server-auth

Microservicio de autenticación del sistema Coperex Interfer. Gestiona registro de usuarios, login, verificación de email, reseteo de contraseña y perfiles. Expone una API REST bajo `/api/v1/coperex`.

**Stack:** Node.js (ESM) · Express v5 · Sequelize v6 · PostgreSQL 16 · Argon2 · JWT · Cloudinary · Nodemailer

---

## Requisitos previos

- Node.js >= 18
- pnpm >= 10
- Docker (para la base de datos PostgreSQL)
- Cuenta en Cloudinary (para subida de avatares)
- Cuenta SMTP / Gmail App Password (para envío de emails)

---

## Configuración del entorno

Crea el archivo `apps/server-auth/.env` con el siguiente contenido:

```env
NODE_ENV=development
PORT=3939

# PostgreSQL
DB_HOST=localhost
DB_PORT=5440
DB_NAME=DBCoperexInterferAuth
DB_USERNAME=root
DB_PASSWORD=admin
DB_SQL_LOGGING=false

# JWT
JWT_SECRET=MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=AuthService
JWT_AUDIENCE=AuthService

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_ENABLE_SSL=true
SMTP_USERNAME=tu_correo@gmail.com
SMTP_PASSWORD=tu_app_password
EMAIL_FROM=tu_correo@gmail.com
EMAIL_FROM_NAME=Coperex Interfer App

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_BASE_URL=https://res.cloudinary.com/tu_cloud_name/image/upload/
CLOUDINARY_FOLDER=coperex
CLOUDINARY_DEFAULT_AVATAR_FILENAME=default-avatar.png

# Archivos
UPLOAD_PATH=./uploads

# CORS / Frontend
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ADMIN_ALLOWED_ORIGINS=http://localhost:5173

# Tokens de verificación
VERIFICATION_EMAIL_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1
```

---

## Base de datos

La base de datos PostgreSQL se levanta con Docker Compose desde la raíz del repositorio:

```bash
docker-compose up -d
```

El contenedor expone PostgreSQL en `localhost:5440`. Sequelize sincroniza el esquema automáticamente (`alter: true`) al iniciar el servidor en modo desarrollo.

---

## Instalación de dependencias

Desde la raíz del monorepo:

```bash
pnpm install
```

---

## Ejecución

### Desarrollo (con nodemon)

```bash
# Desde la raíz del monorepo
pnpm --filter server-auth dev

# O directamente desde el directorio del servicio
cd apps/server-auth
pnpm dev
```

### Producción

```bash
pnpm --filter server-auth start
```

El servidor arranca en `http://localhost:3939`.

---

## Usuario administrador por defecto

Al iniciar el servidor por primera vez, se crea automáticamente un usuario administrador:

| Campo | Valor |
|-------|-------|
| Email | `admin@gmail.com` |
| Contraseña | `admin123` |

---

## API

Base URL: `http://localhost:3939/api/v1/coperex`

### Autenticación (`/auth`)

| Método | Ruta | Descripción | Auth requerida |
|--------|------|-------------|----------------|
| POST | `/auth/register` | Registrar nuevo usuario (con avatar) | JWT |
| POST | `/auth/login` | Login con email/username y contraseña | No |
| POST | `/auth/verify-email` | Verificar email con token | No |
| POST | `/auth/resend-verification` | Reenviar email de verificación | No |
| POST | `/auth/forgot-password` | Solicitar reseteo de contraseña | No |
| POST | `/auth/reset-password` | Resetear contraseña con token | No |
| GET | `/auth/profile` | Ver perfil propio | JWT |
| POST | `/auth/profile/by-id` | Ver perfil por userId | No |
| GET | `/health` | Health check | No |

### Rate limiting

| Limitador | Límite |
|-----------|--------|
| authRateLimit | 5 solicitudes / minuto |
| requestLimit | 100 solicitudes / 15 minutos |

### Autenticación con JWT

Incluir el token en el header:

```
Authorization: Bearer <token>
# o
x-token: <token>
```

---

## Estructura de directorios

```
server-auth/
├── index.js              # Punto de entrada
├── configs/
│   ├── app.js            # Bootstrap de Express
│   ├── config.js         # Variables de entorno tipadas
│   └── db.js             # Conexión Sequelize
├── src/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   └── auth.routes.js
│   └── users/
│       ├── user.controller.js
│       └── user.model.js
├── middlewares/
│   ├── server-genericError-handler.js
│   └── validation.js
├── helpers/              # Servicios: email, cloudinary, JWT, etc.
└── utils/                # Utilidades de auth, contraseñas y usuarios
```
