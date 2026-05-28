using System.Text;
using BackEnd.Data;
using BackEnd.Models;
using BackEnd.Repositories;
using BackEnd.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────
// 1. Base de datos — Entity Framework Core + PostgreSQL
// ─────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ─────────────────────────────────────────────
// 2. Repositorios — inyección de dependencias
// ─────────────────────────────────────────────
builder.Services.AddScoped<ILocalRepository, LocalRepository>();
builder.Services.AddScoped<IEventoRepository, EventoRepository>();
builder.Services.AddScoped<ISlideCarruselRepository, SlideCarruselRepository>();
builder.Services.AddScoped<IPerfilCarruselRepository, PerfilCarruselRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();

// ─────────────────────────────────────────────
// 3. JWT — autenticación
// ─────────────────────────────────────────────
var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSection["Key"]!)),
            ClockSkew = TimeSpan.Zero // sin margen extra sobre la expiración de 24 h
        };
    });

builder.Services.AddAuthorization();

// ─────────────────────────────────────────────
// 4. CORS — permite que el Frontend consuma la API
// ─────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                builder.Configuration.GetSection("WithOrigins").Get<string[]>()!)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ─────────────────────────────────────────────
// 5. Controladores y Swagger
// ─────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ═════════════════════════════════════════════
var app = builder.Build();
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// 6. Seed inicial de usuarios
// ─────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();

    if (!await db.Usuarios.AnyAsync())
    {
        db.Usuarios.AddRange(
            new Usuario
            {
                Username = "admin",
                PasswordHash = PasswordService.Hash("admin123"),
                Nombre = "Administrador",
                Rol = "admin"
            },
            new Usuario
            {
                Username = "editor",
                PasswordHash = PasswordService.Hash("editor123"),
                Nombre = "Editor de Contenido",
                Rol = "editor"
            }
        );
        await db.SaveChangesAsync();
    }

    if (!await db.Categorias.AnyAsync())
    {
        db.Categorias.AddRange(
            new BackEnd.Models.Categoria { Nombre = "Gastronomía", Color = "#f97316" },
            new BackEnd.Models.Categoria { Nombre = "Moda", Color = "#ec4899" },
            new BackEnd.Models.Categoria { Nombre = "Tecnología", Color = "#3b82f6" },
            new BackEnd.Models.Categoria { Nombre = "Entretenimiento", Color = "#a855f7" },
            new BackEnd.Models.Categoria { Nombre = "Servicios", Color = "#6b7280" },
            new BackEnd.Models.Categoria { Nombre = "Belleza", Color = "#f43f5e" },
            new BackEnd.Models.Categoria { Nombre = "Hogar", Color = "#22c55e" },
            new BackEnd.Models.Categoria { Nombre = "Deportes", Color = "#10b981" }
        );
        await db.SaveChangesAsync();
    }
}

// ─────────────────────────────────────────────
// 7. Pipeline HTTP
// ─────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// IMPORTANTE: UseCors antes de UseAuthentication/UseAuthorization
app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();