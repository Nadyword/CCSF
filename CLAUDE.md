# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CCSF — Centro Comercial Santa Fe

Aplicación fullstack para el directorio y eventos de un centro comercial.

## Arquitectura

- **BackEnd**: ASP.NET Core 10 Web API — `BackEnd/`
- **FrontEnd**: Next.js 16 + React 19 — `FrontEnd/`

## BackEnd (ASP.NET Core 10)

### Comandos

```bash
cd BackEnd
dotnet run           # API en http://localhost:5081 + Swagger en /swagger
dotnet build         # compilar sin ejecutar
dotnet ef migrations add <NombreMigracion>
dotnet ef database update
```

### Stack

- .NET 10 + ASP.NET Core Web API
- Entity Framework Core 10 con SQL Server (remoto — ver `appsettings.json`)
- JWT Bearer (`System.IdentityModel.Tokens.Jwt`) — tokens de 24 h, BCrypt para contraseñas
- Swagger/Swashbuckle (solo en Development)
- Patrón Repository con interfaces (`I<Modelo>Repository` / `<Modelo>Repository`)

### Base de datos

- **Motor**: SQL Server remoto (configurado en `appsettings.json` → `ConnectionStrings.DefaultConnection`)
- **Nombre BD**: `SantaFeDB`
- Al arrancar, `Program.cs` ejecuta `MigrateAsync()` y hace seed automático de usuarios y categorías si las tablas están vacías.

### Modelos principales

| Modelo | Descripción |
|--------|-------------|
| `Local` | Tiendas del directorio (nombre, nivel, número, descripción, horario, teléfono, foto) |
| `Evento` | Eventos del centro (título, fechaInicio, fechaFin, lugar, destacado) |
| `Categoria` | Etiquetas para locales (nombre, color hex); relación N:M con `Local` via `LocalCategoria` |
| `PerfilCarrusel` | Perfil de configuración del carrusel hero; solo uno puede estar `activo` |
| `SlideCarrusel` | Slide individual con imagen, textos, animación, orden y tiempo de permanencia |
| `Usuario` | Credenciales de acceso; roles `admin` y `editor` |

### Endpoints API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Login → `{ token, username, nombre, rol }` |
| GET | `/api/locales` | No | Todos los locales |
| POST | `/api/locales` | Sí | Crear local |
| PUT | `/api/locales/{id}` | Sí | Actualizar local |
| DELETE | `/api/locales/{id}` | Sí | Eliminar local |
| GET | `/api/categorias` | No | Todas las categorías |
| POST/PUT/DELETE | `/api/categorias/{id}` | Sí | CRUD categorías |
| GET | `/api/eventos` | No | Eventos próximos (FechaFin >= hoy) |
| GET | `/api/eventos/todos` | Sí | Todos los eventos sin filtro de fecha |
| GET | `/api/eventos/{id}` | No | Detalle de evento |
| POST | `/api/eventos` | Sí | Crear evento |
| PUT/DELETE | `/api/eventos/{id}` | Sí | Actualizar / eliminar evento |
| POST | `/api/eventos/{id}/destacar` | Sí | Toggle evento destacado del Home (uno a la vez) |
| GET | `/api/perfilcarrusel` | No | Lista de perfiles (resumen) |
| GET | `/api/perfilcarrusel/activo` | No | Perfil activo con sus slides (204 si ninguno) |
| GET | `/api/perfilcarrusel/{id}` | No | Perfil completo con slides |
| POST/PUT/DELETE | `/api/perfilcarrusel/{id}` | Sí | CRUD perfiles |
| POST | `/api/perfilcarrusel/{id}/activar` | Sí | Activar perfil (desactiva el resto) |
| POST/PUT/DELETE | `/api/slidecarrusel/{id}` | Sí | CRUD slides |

### CORS

Configurado para `http://localhost:3000`, `http://localhost:3001` y `https://localhost:3000`.

## FrontEnd (Next.js 16)

### Comandos

```bash
cd FrontEnd
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

### Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (estilo "new-york")
- React Hook Form + Zod para formularios
- Lucide React para íconos
- Fuentes: Montserrat + DM Serif Display

### Variable de entorno

```
NEXT_PUBLIC_API_URL=http://localhost:5081   # valor por defecto en lib/api.ts si no se define
```

### Páginas

- `/` — Home: carrusel hero, evento destacado, locales aleatorios, sección info
- `/directorio` — Directorio filtrable de locales
- `/eventos` — Listado de eventos próximos
- `/admin` — Dashboard CRUD para eventos, locales, categorías y carrusel

### Arquitectura de datos

- **`lib/api.ts`** — cliente HTTP completo hacia el BackEnd. Centraliza todos los `fetch`, los mappers de tipos (IDs del backend son `int`, en el frontend se usan como `string`) y la gestión del token JWT (`cc_token` en `localStorage`).
- **`contexts/data-context.tsx`** — fuente única de verdad para el estado global (`eventos`, `locales`, `categorias`, `perfilActivo`). Todos los componentes consumen datos a través de `useData()`, nunca llaman a `lib/api.ts` directamente.
- **`contexts/auth-context.tsx`** — gestiona el login/logout y expone el usuario autenticado. Los endpoints de escritura del admin requieren el JWT en el header `Authorization: Bearer <token>`.
- **`lib/types.ts`** — todas las interfaces TypeScript compartidas del frontend.
- **`lib/data.ts`** — solo contiene `configuracionHomeData` (estado inicial legacy). La integración con la API está completa.

### Rutas API de Next.js (gestión de imágenes)

Next.js expone route handlers que administran archivos en `public/`:

| Ruta | Carpeta | Descripción |
|------|---------|-------------|
| `/api/locales` | `public/Locales/` | Upload / listado / borrado de imágenes de locales |
| `/api/eventos` | `public/Eventos/` | Upload / listado / borrado de imágenes de eventos |
| `/api/carrusel` | `public/carrusel/` | Upload / listado / borrado / renombrado de slides |

Estas rutas son locales al servidor de Next.js (no van al BackEnd de .NET).

### Lógica destacada del carrusel

El Home muestra el `PerfilCarrusel` con `activo = true`. Activar un perfil desactiva todos los demás (operación exclusiva). Los slides dentro del perfil tienen `orden`, `animacionEntrada`, `estiloTransicion` y `tiempoPermanencia` (ms).

## Convenciones

- Los DTOs del backend se nombran `<Modelo>Dto.cs` / `Upsert<Modelo>Dto`
- Los repositorios implementan `I<Modelo>Repository`
- Los componentes Next.js usan PascalCase
- Usar `shadcn/ui` para nuevos componentes de UI antes de crear componentes custom
- IDs: el backend usa `int`; el frontend los trata como `string` — la conversión ocurre en los mappers de `lib/api.ts`
