using System.Threading.Tasks;
using IRepository.Generic;
using IService;
using web.Models;
using web.Models.Dtos;
using web.Models.enums;

namespace Services;

public class AirQualityPredictionSerivce : IAirQualityPredictionService
{
    private readonly IRepository<AirQualityPrediction> _repository;
    private readonly ISubscriberService _subscriberService;
    private readonly HttpClient _httpClient = new();

    public AirQualityPredictionSerivce(IRepository<AirQualityPrediction> repository, ISubscriberService subscriberService)
    {
        _repository = repository;
        _subscriberService = subscriberService;
    }

    public async Task<AirQualityPrediction> AddAirQualityData(AirQualityPrediction airQualityPrediction
    )
    {
        this.GetAQICategory(airQualityPrediction.AQI);
        var air = await _repository.CreateAsync(airQualityPrediction);
        return air;
    }

    public async Task<List<AirQualityPrediction>> GetLastMonthAirQualityFor(string location)
    {
        var lastMonth = DateTime.Today.AddMonths(-1);
        var lst = await _repository.RetrieveAllAsync(aqp => aqp.PredictionDate == lastMonth);
        return lst.ToList();
    }

    public async Task<List<AirQualityPrediction>> GetLastWeekAirQualityFor(string location)
    {
        var lastWeek = DateTime.Today.AddDays(-7);
        var lst = await _repository.RetrieveAllAsync(aqp => aqp.PredictionDate == lastWeek);
        return lst.ToList();
    }

    public async Task<List<AirQualityPrediction>> GetTodayAirQualityFor(string location)
    {

        var today = DateTime.Today;
        var lst = await _repository.RetrieveAllAsync(aqp => aqp.PredictionDate == today);
        return lst.ToList();
    }

    public async Task<AirQualityPrediction> GetAirQualityPredictionsAsync(AirQualityRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync("FastApi.Url", request);
        var result = await response.Content.ReadFromJsonAsync<PredictionResponse>();
        var air = new AirQualityPrediction
        {
            PredictionDate = DateTime.UtcNow,
            AQI = (decimal)result.Prediction,
            SourceModel = "BreathSafe-Model",
            AdvisoryMessage = $"Predicted AQI is {result.Prediction}, Be safe."
        };

        air =   await   this.AddAirQualityData(air);
        return air;
    }

    async Task GetAQICategory(decimal aqi)
    {
        switch (aqi)
        {
            case decimal n when (n >= 101 && n <= 150):
                await _subscriberService.Notify(SubscriberType.ElderCareFacilityManager);
                await _subscriberService.Notify(SubscriberType.IndustrialZoneResident);
                await _subscriberService.Notify(SubscriberType.HealthSensitiveGroup);
                break;
            case decimal n when (n >= 151 && n <= 200):
                await _subscriberService.Notify(SubscriberType.HealthSensitiveGroup);
                break;
            case decimal n when (n >= 201 && n <= 300):
                await _subscriberService.Notify(SubscriberType.HealthSensitiveGroup);
                await _subscriberService.Notify(SubscriberType.DisasterReadinessOrganization);

                break;
            case decimal n when (n >= 301 && n <= 500):
                await _subscriberService.Notify(SubscriberType.HealthSensitiveGroup);
                await _subscriberService.Notify(SubscriberType.CrisisCommunicationSpecialist);
                await _subscriberService.Notify(SubscriberType.DisasterReadinessOrganization);
                await _subscriberService.Notify(SubscriberType.MeteorologicalServiceProvider);
                await _subscriberService.Notify(SubscriberType.TourismBoard);
                await _subscriberService.Notify(SubscriberType.WildfireManagementTeam);
                await _subscriberService.Notify(SubscriberType.InsuranceRiskAssessor);
                await _subscriberService.Notify(SubscriberType.SchoolDistrictHealthOfficer);
                await _subscriberService.Notify(SubscriberType.GovernmentOfficial);
                await _subscriberService.Notify(SubscriberType.GeneralPublic);
                break;
            default:

                return;
                // return "Invalid AQI";
        }
    }
}