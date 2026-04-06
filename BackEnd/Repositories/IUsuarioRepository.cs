using BackEnd.Models;

namespace BackEnd.Repositories;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByUsernameAsync(string username);
}
