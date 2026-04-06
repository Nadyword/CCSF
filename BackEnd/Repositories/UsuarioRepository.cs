using BackEnd.Data;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

public class UsuarioRepository(AppDbContext db) : IUsuarioRepository
{
    public Task<Usuario?> GetByUsernameAsync(string username) =>
        db.Usuarios.FirstOrDefaultAsync(u => u.Username == username);
}
