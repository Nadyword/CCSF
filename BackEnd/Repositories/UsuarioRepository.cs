using BackEnd.Data;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

public class UsuarioRepository(AppDbContext db) : IUsuarioRepository
{
    public Task<Usuario?> GetByUsernameAsync(string username) =>
        db.Usuarios.FirstOrDefaultAsync(u => u.Username == username);

    public Task<Usuario?> GetByIdAsync(int id) =>
        db.Usuarios.FirstOrDefaultAsync(u => u.Id == id);

    public async Task UpdatePasswordAsync(int id, string newPasswordHash)
    {
        var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
        if (usuario is null) return;

        usuario.PasswordHash = newPasswordHash;
        await db.SaveChangesAsync();
    }
}
