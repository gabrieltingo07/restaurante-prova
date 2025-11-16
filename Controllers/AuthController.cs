using Microsoft.AspNetCore.Mvc;

namespace ProjetoRestaurante.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/auth
    public class AuthController : ControllerBase
    {
        public class LoginDto
        {
            public string Username { get; set; } = "";
            public string Senha { get; set; } = "";
        }

        public class LoginResponse
        {
            public string Username { get; set; } = "";
            public string Role { get; set; } = "";
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.Username) ||
                string.IsNullOrWhiteSpace(dto.Senha))
            {
                return BadRequest(new { message = "Usuário ou senha vazios." });
            }

            // ***** USUÁRIOS FIXOS SÓ PARA A PROVA *****
            // cozinha / 123  -> vai pra tela da cozinha
            if (dto.Username == "cozinha" && dto.Senha == "123")
            {
                return Ok(new LoginResponse
                {
                    Username = "cozinha",
                    Role = "Cozinha"
                });
            }

            // copa / 123 -> vai pra tela da copa
            if (dto.Username == "copa" && dto.Senha == "123")
            {
                return Ok(new LoginResponse
                {
                    Username = "copa",
                    Role = "Copa"
                });
            }

            // qualquer outro → inválido
            return Unauthorized(new { message = "Usuário ou senha inválidos." });
        }
    }
}
