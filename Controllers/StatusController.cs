using Microsoft.AspNetCore.Mvc;

namespace RestauranteAppProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class StatusController : ControllerBase
    {
        // GET api/status
        [HttpGet]
        public string Get()
        {
            return "API do restaurante está no ar!";
        }
    }
}
