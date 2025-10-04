using System.Threading.Tasks;
using IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using web.Models;
using web.Models.Dtos;

namespace Controllers;

[ApiController]
[Route("api/AirQuality")]
public class HomeControllers : ControllerBase
{
    private readonly IAirQualityPredictionService _airQualityService;

    public HomeControllers(IAirQualityPredictionService airQualityService)
    {
        _airQualityService = airQualityService;
    }

    [HttpGet("Today/{location}")]
    public async Task<IActionResult> index(string location)
    {
        var airQualityData = await _airQualityService.GetTodayAirQualityFor(location);
        return Ok(airQualityData);
    }
    [HttpGet("LastMonth/{location}")]
    public async Task<IActionResult> LastMonth(string location)
    {
        var airQualityData = await _airQualityService.GetLastMonthAirQualityFor(location);
        return Ok(airQualityData);
    }
    [HttpGet("LastWeek/{location}")]
    public async Task<IActionResult> LastWeek(string location)
    {
        var airQualityData = await _airQualityService.GetLastWeekAirQualityFor(location);
        return Ok(airQualityData);
    }
  
    [HttpGet("PredictAir")]
    public async Task<IActionResult> PreidctAirQuality(AirQualityRequest request)
    {
        var airQualityData = await _airQualityService.GetAirQualityPredictionsAsync(request);
        return Ok(airQualityData);
    }  
}

