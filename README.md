# Coperex Interfer — Monorepo

Backend monorepo para el sistema Coperex Interfer, compuesto por dos microservicios independientes y una librería compartida. Gestionado con **pnpm workspaces**.

---

## Estructura del repositorio

```
coperex-interfer/
├── apps/
│   ├── server-auth/        # Microservicio de autenticación (PostgreSQL)
│   └── server-admin/       # Microservicio de administración/empresas (MongoDB)
├── packages/
│   └── shared_core/        # Librería compartida (@coperex-interfer/shared)
├── docker-compose.yml      # PostgreSQL vía Docker
├── pnpm-workspace.yaml
└── package.json
```

---

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | >= 18 |
| pnpm | 10.28.1 |
| Docker + Docker Compose | Cualquier versión estable |
| MongoDB | >= 6 (instancia local) |

Instalar pnpm globalmente si no está disponible:

```bash
npm install -g pnpm@10.28.1
```

---

## Instalación

Desde la raíz del repositorio:

```bash
pnpm install
```

Esto instala las dependencias de todos los workspaces (`apps/*` y `packages/*`).

---

## Variables de entorno

Cada aplicación requiere su propio archivo `.env` dentro de su directorio:

- `apps/server-auth/.env`
- `apps/server-admin/.env`

Consulta el README de cada aplicación para ver la lista completa de variables requeridas.

---

## Bases de datos

### PostgreSQL (server-auth)

Levantada con Docker Compose:

```bash
docker-compose up -d
```

Esto inicia un contenedor PostgreSQL 16 en el puerto `5440` del host, con la base de datos `DBCoperexInterferAuth`.

### MongoDB (server-admin)

Debe estar corriendo localmente en `localhost:27017`. Instálalo o ejecútalo según tu sistema operativo.

---

## Ejecución

### Desarrollo — todos los servicios en paralelo

```bash
pnpm dev
```

Inicia todos los servicios en modo desarrollo con `nodemon`.

### Desarrollo — un servicio específico

```bash
pnpm --filter server-auth dev
pnpm --filter server-admin dev
```

### Producción

```bash
pnpm start
```

O de forma individual:

```bash
pnpm --filter server-auth start
pnpm --filter server-admin start
```

---

## Servicios y puertos

| Servicio | Puerto | Base de datos | Health check |
|----------|--------|---------------|--------------|
| server-auth | `3939` | PostgreSQL:5440 | `GET /api/v1/coperex/health` |
| server-admin | `3008` | MongoDB:27017 | `GET /api/v1/coperexAdmin/Health` |

---

## Proyectos

- [`apps/server-auth`](./apps/server-auth/README.md) — Registro, login, verificación de email, reseteo de contraseña.
- [`apps/server-admin`](./apps/server-admin/README.md) — CRUD de empresas, reportes Excel.
- [`packages/shared_core`](./packages/shared_core/README.md) — Middlewares y configuraciones compartidas.
