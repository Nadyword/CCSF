using BackEnd.Models;

namespace BackEnd.Repositories;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByUsernameAsync(string username);
    Task<Usuario?> GetByIdAsync(int id);
    Task UpdatePasswordAsync(int id, string newPasswordHash);
}
