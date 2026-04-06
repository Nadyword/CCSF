# CCSF — Centro Comercial Santa Fe

Aplicación fullstack para el directorio y eventos de un centro comercial.

## Arquitectura

- **BackEnd**: ASP.NET Core 10 Web API — `BackEnd/`
- **FrontEnd**: Next.js 16 + React 19 — `FrontEnd/`

## BackEnd (ASP.NET Core 10)

### Ejecutar

```bash
cd BackEnd
dotnet run
# API en https://localhost:7xxx / http://localhost:5xxx
# Swagger UI disponible en /swagger (solo en Development)
```

### Migraciones EF Core

```bash
cd BackEnd
dotnet ef migrations add <NombreMigracion>
dotnet ef database update
```

### Stack

- .NET 10 + ASP.NET Core Web API
- Entity Framework Core 10 con SQL Server (LocalDB)
- Swagger/Swashbuckle
- Patrón Repository con interfaces

### Base de datos

- **Motor**: SQL Server LocalDB
- **Nombre BD**: `CCFE`
- **Cadena de conexión**: `Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=CCFE;Trusted_Connection=True;`

### Modelos principales

- `Local` — locales del directorio (nombre, nivel, categoría, horario, teléfono)
- `Evento` — eventos del centro (título, fechaInicio, fechaFin, lugar, localId FK nullable)

### Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/locales/random?cantidad=6` | Locales aleatorios para el home |
| GET | `/api/locales?busqueda=&categoria=` | Directorio con filtros |
| GET | `/api/eventos` | Eventos próximos (FechaFin >= hoy) |
| GET | `/api/eventos/{id}` | Detalle de un evento |

### CORS

Configurado para `http://localhost:3000` y `http://localhost:3001` (FrontEnd Next.js).

## FrontEnd (Next.js 16)

### Ejecutar

```bash
cd FrontEnd
npm install   # o pnpm install
npm run dev   # http://localhost:3000
```

### Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (estilo "new-york")
- React Hook Form + Zod para formularios
- Lucide React para íconos
- Fuentes: Montserrat + DM Serif Display

### Páginas

- `/` — Home: hero, evento destacado, locales aleatorios, sección info
- `/directorio` — Directorio filtrable de locales
- `/eventos` — Listado de eventos próximos
- `/admin` — Dashboard para gestionar eventos, locales y configuración del home

### Estructura clave

```
app/            # App Router (pages)
components/     # Componentes reutilizables
  home/         # Secciones del home
  admin/        # Gestores CRUD del panel admin
  ui/           # Componentes shadcn/ui
contexts/       # AuthContext + DataContext (estado global)
lib/
  data.ts       # Datos mock (reemplazar con llamadas a API)
  types.ts      # Interfaces TypeScript
```

### Autenticación

Simulada en el cliente con `localStorage` vía `AuthContext`. Sin integración con backend aún.

### Datos

El FrontEnd actualmente usa datos mock en `lib/data.ts`. La integración real con la API del BackEnd está pendiente.

## Convenciones

- Los DTOs del backend se nombran `<Modelo>Dto.cs`
- Los repositorios siguen el patrón `I<Modelo>Repository` / `<Modelo>Repository`
- Los componentes de Next.js usan PascalCase
- Usar `shadcn/ui` para nuevos componentes de UI antes de crear componentes custom
