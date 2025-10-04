using Microsoft.AspNetCore.Mvc;

namespace Controllers;

[ApiController]
[Route("api/home")]
public class HomeControllers : ControllerBase
{
    [HttpGet("index")]
    public IActionResult index()
    {
        return Content("Worked fine");
}
}

