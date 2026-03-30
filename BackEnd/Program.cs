using BackEnd.Data;
using BackEnd.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────
// 1. Base de datos — Entity Framework Core + SQLite
// ─────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ─────────────────────────────────────────────
// 2. Repositorios — inyección de dependencias
// ─────────────────────────────────────────────
builder.Services.AddScoped<ILocalRepository, LocalRepository>();
builder.Services.AddScoped<IEventoRepository, EventoRepository>();

// ─────────────────────────────────────────────
// 3. CORS — permite que el Frontend consuma la API
//    Ajusta el puerto de tu app Next.js si es diferente.
// ─────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",   // Next.js dev server (puerto por defecto)
                "http://localhost:3001",   // Por si usas un puerto alternativo
                "https://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ─────────────────────────────────────────────
// 4. Controladores y Swagger
// ─────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ═════════════════════════════════════════════
var app = builder.Build();
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// 5. Pipeline HTTP
// ─────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANTE: UseCors debe ir antes de UseAuthorization y MapControllers
app.UseCors("FrontendPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
