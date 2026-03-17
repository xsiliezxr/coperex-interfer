# server-admin

Microservicio de administración del sistema Coperex Interfer. Gestiona el CRUD de empresas y la generación de reportes Excel. Expone una API REST bajo `/api/v1/coperexAdmin`.

**Stack:** Node.js (ESM) · Express v5 · Mongoose v9 · MongoDB · JWT · Cloudinary · ExcelJS

---

## Requisitos previos

- Node.js >= 18
- pnpm >= 10
- MongoDB >= 6 corriendo localmente en `localhost:27017`
- Cuenta en Cloudinary (para subida de imágenes de empresas)
- JWT Secret compartido con `server-auth`

---

## Configuración del entorno

Crea el archivo `apps/server-admin/.env` con el siguiente contenido:

```env
NODE_ENV=development
PORT=3008

# MongoDB
URI_MONGO=mongodb://localhost:27017/DBCoperexInterferAdmin

# JWT (debe coincidir con server-auth)
JWT_SECRET=MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!
JWT_ISSUER=AuthService
JWT_AUDIENCE=AuthService

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=coperex/
```

> El `JWT_SECRET` debe ser el mismo que usa `server-auth`, ya que los tokens emitidos por ese servicio son validados aquí.

---

## Base de datos

MongoDB debe estar corriendo en `localhost:27017` antes de iniciar el servicio. No hay configuración Docker para MongoDB en este repositorio.

Para iniciarlo localmente:

```bash
# Con mongod instalado directamente
mongod

# O con Docker (manual)
docker run -d -p 27017:27017 --name mongo mongo:6
```

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
pnpm --filter server-admin dev

# O directamente desde el directorio del servicio
cd apps/server-admin
pnpm dev
```

### Producción

```bash
pnpm --filter server-admin start
```

El servidor arranca en `http://localhost:3008`.

---

## API

Base URL: `http://localhost:3008/api/v1/coperexAdmin`

Todos los endpoints (excepto el health check) requieren un JWT válido emitido por `server-auth`.

### Header de autenticación

```
Authorization: Bearer <token>
# o
x-token: <token>
```

### Empresas (`/companies`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/companies` | Listar empresas con filtros y paginación |
| POST | `/companies` | Crear empresa |
| GET | `/companies/:id` | Obtener empresa por ID |
| PUT | `/companies/:id` | Actualizar empresa |
| PATCH | `/companies/:id/status` | Activar / desactivar empresa |
| GET | `/companies/report/excel` | Descargar reporte Excel de todas las empresas |
| GET | `/companies/Health` | Health check |

### Parámetros de listado (`GET /companies`)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `category` | string | Filtrar por categoría |
| `yearsTrayectory` | number | Filtrar por años de trayectoria |
| `sort` | `A-Z` \| `Z-A` | Ordenar por nombre |
| `page` | number | Página (paginación) |
| `limit` | number | Resultados por página |

### Campos de empresa

| Campo | Tipo | Valores permitidos |
|-------|------|-------------------|
| `name` | string | Único, requerido |
| `description` | string | — |
| `address` | string | — |
| `email` | string | — |
| `phone` | string | 8 dígitos |
| `levelImpact` | enum | `LOW`, `MEDIUM`, `HIGH`, `EXCELLENT` |
| `yearsTrayectory` | number | Entero >= 0 |
| `category` | enum | Ver lista abajo |
| `isActive` | boolean | Default: `true` |

**Categorías disponibles:**
`TECNOLOGIA` · `ALIMENTOS_Y_BEBIDAS` · `TEXTIL_Y_CALZADO` · `AUTOMOTRIZ` · `CONSTRUCCION` · `SALUD_Y_BELLEZA` · `HOGAR_Y_DECORACION` · `ARTESANIAS` · `AGROINDUSTRIA` · `SERVICIOS_FINANCIEROS` · `OTRO`

### Reporte Excel

`GET /companies/report/excel` devuelve un archivo `.xlsx` con columnas: Nombre, Categoría, Años de trayectoria, Nivel de impacto, Estado. Incluye encabezados estilizados y auto-filtros.

---

## Estructura de directorios

```
server-admin/
├── index.js              # Punto de entrada
├── configs/
│   ├── app.js            # Bootstrap de Express
│   └── db.js             # Conexión Mongoose
├── src/
│   └── companies/
│       ├── company.controller.js
│       ├── company.model.js
│       └── company.routes.js
├── middlewares/
│   ├── checkValidators.js
│   ├── handle-errors.js
│   └── validate-company.js
└── helpers/
    ├── excel-generator.js  # Generación de reportes con ExcelJS
    └── query-builder.js    # Constructor de filtros para MongoDB
```
