namespace BackEnd.DTOs;

public record LoginRequestDto(string Username, string Password);
public record LoginResponseDto(string Token, string Username, string Nombre, string Rol);
public record ChangePasswordDto(string PasswordActual, string PasswordNueva);
