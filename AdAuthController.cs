using Microsoft.AspNetCore.Mvc;

namespace SeuProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdAuthController : ControllerBase
    {
        [HttpPost]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Sua lógica de autenticação aqui
            return Ok(new { success = true });
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
