# CCSF — BackEnd

API REST construida con **ASP.NET Core (.NET 10)** y **Entity Framework Core + SQLite**.

---

## Requisitos previos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- CLI de EF Core (instalar una sola vez):

```bash
dotnet tool install --global dotnet-ef
```

---

## Configuración inicial

### 1. Restaurar paquetes NuGet

```bash
dotnet restore
```

### 2. Crear la migración inicial

Genera los archivos de migración a partir de los modelos definidos en el código:

```bash
dotnet ef migrations add InitialCreate
```

### 3. Aplicar la migración y crear la base de datos

Crea el archivo `ccsf.db` (SQLite) y aplica el esquema:

```bash
dotnet ef database update
```

---

## Comandos de migraciones adicionales

### Agregar una nueva migración (tras cambiar un modelo)

```bash
dotnet ef migrations add NombreDeLaMigracion
```

### Aplicar migraciones pendientes

```bash
dotnet ef database update
```

### Revertir a una migración anterior

```bash
dotnet ef database update NombreDeLaMigracionAnterior
```

### Eliminar la última migración (si aún no fue aplicada)

```bash
dotnet ef migrations remove
```

### Ver el listado de migraciones y su estado

```bash
dotnet ef migrations list
```

---

## Ejecutar el proyecto

```bash
dotnet run
```

La API queda disponible en `https://localhost:{puerto}` (el puerto lo asigna el runtime; puedes fijarlo en `Properties/launchSettings.json`).

Swagger UI en desarrollo: `https://localhost:{puerto}/swagger`

---

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/locales/random?cantidad=6` | Locales aleatorios para el Home |
| `GET` | `/api/locales?busqueda=&categoria=` | Directorio completo con filtros opcionales |
| `GET` | `/api/eventos` | Eventos próximos (FechaFin >= hoy) |
| `GET` | `/api/eventos/{id}` | Detalle de un evento con datos del local |

---

## Cadena de conexión

Definida en `appsettings.json`. Por defecto crea `ccsf.db` en la raíz del proyecto:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=ccsf.db"
}
```

Para usar **SQL Server** en producción, reemplaza el valor por:

```
Server=tu_servidor;Database=ccsf;Trusted_Connection=True;
```

Y cambia el paquete NuGet en `BackEnd.csproj`:

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.*" />
```

Y en `Program.cs` reemplaza `UseSqlite` por `UseSqlServer`.
