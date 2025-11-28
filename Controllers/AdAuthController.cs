using Microsoft.AspNetCore.Mvc;
using System.DirectoryServices.AccountManagement;
using System.Runtime.Versioning;

namespace SIVIS_ALTERADO.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdAuthController : ControllerBase
    {
        [SupportedOSPlatform("windows")]
        [HttpPost]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { success = false, message = "Usuário e senha são obrigatórios" });
            }

            try
            {
                // Variáveis de ambiente LDAP
                string ldapServer = Environment.GetEnvironmentVariable("AUTH_LDAP_SERVER_URI")!;
                string ldapUser = Environment.GetEnvironmentVariable("AUTH_LDAP_BIND_DN")!;
                string ldapPassword = Environment.GetEnvironmentVariable("AUTH_LDAP_BIND_PASSWORD")!;

                using (var context = new PrincipalContext(
                    ContextType.Domain,
                    ldapServer,
                    null,
                    ContextOptions.Negotiate,
                    ldapUser,
                    ldapPassword
                ))
                {
                    bool isValid = context.ValidateCredentials(model.Username, model.Password);

                    if (isValid)
                        return Ok(new { success = true });
                    else
                        return BadRequest(new { success = false, message = "Usuário ou senha inválidos" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro LDAP: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Erro ao autenticar no AD" });
            }
        }
    }

    public class LoginModel
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
