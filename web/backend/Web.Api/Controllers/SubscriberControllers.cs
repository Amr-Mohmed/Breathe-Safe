using IService;
using Microsoft.AspNetCore.Mvc;
using web.Models;

namespace Controllers;

[ApiController]
[Route("api/Subscriber")]
public class SubscriberControllers : ControllerBase
{
    private readonly ISubscriberService _subscriber;

    public SubscriberControllers(ISubscriberService subscriber)
    {
        _subscriber = subscriber;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddSubsriber(Subscriber subscriber)
    {
        await _subscriber.AddSubscriber(subscriber);  
        return Ok("Worked fine");
}
}

