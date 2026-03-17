# @coperex-interfer/shared

Librería compartida del monorepo Coperex Interfer. Exporta middlewares, rate limiters y configuraciones reutilizadas por `server-auth` y `server-admin`.

---

## Uso

Este paquete es consumido internamente mediante la referencia de workspace:

```json
"@coperex-interfer/shared": "workspace:*"
```

No se publica en npm. Se instala automáticamente con `pnpm install` desde la raíz del monorepo.

---

## Exportaciones

### `validateJWT`

Middleware de Express que valida un JWT en `Authorization: Bearer <token>` o en el header `x-token`. Puebla `req.user` con el payload decodificado.

```js
import { validateJWT } from '@coperex-interfer/shared';

router.get('/protected', validateJWT, handler);
```

### Rate limiters

```js
import { requestLimit, authRateLimit, emailRateLimit } from '@coperex-interfer/shared';
```

| Exportación | Límite |
|-------------|--------|
| `requestLimit` | 100 solicitudes / 15 minutos |
| `authRateLimit` | 5 solicitudes / 1 minuto |
| `emailRateLimit` | 3 solicitudes / 15 minutos |

### `helmetConfiguration`

Configuración de Helmet con CSP, frameguard, noSniff, hidePoweredBy y crossOriginResourcePolicy.

```js
import { helmetConfiguration } from '@coperex-interfer/shared';

app.use(helmet(helmetConfiguration));
```

### `corsOptions`

Opciones de CORS preconfiguradas: `origin: true`, `credentials: true`, métodos `GET/POST/PUT/DELETE/OPTIONS`.

```js
import { corsOptions } from '@coperex-interfer/shared';

app.use(cors(corsOptions));
```

### `config`

Objeto de configuración completo construido a partir de variables de entorno (JWT, SMTP, Cloudinary, rate limits, seguridad, CORS, tokens de verificación).

```js
import { config } from '@coperex-interfer/shared';

console.log(config.jwt.secret);
```

---

## Estructura de directorios

```
shared_core/
├── index.js                      # Punto de entrada / re-exportaciones
├── validate-JWT.js               # Middleware validateJWT
├── request-limit.js              # Rate limiters
└── configs/
    ├── config.js                 # Config global desde .env
    ├── cors-configuration.js     # corsOptions
    └── helmet-configuration.js   # helmetConfiguration
```
