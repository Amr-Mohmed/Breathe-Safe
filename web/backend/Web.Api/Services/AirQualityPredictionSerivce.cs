using System.Threading.Tasks;
using IRepository.Generic;
using IService;
using web.Models;
using web.Models.enums;

namespace Services;

public class AirQualityPredictionSerivce : IAirQualityPredictionService
{
    private readonly IRepository<AirQualityPrediction> _repository;
    private readonly ISubscriberService _subscriberService;

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

    public Task<List<AirQualityPrediction>> GetLastMonthAirQualityFor(string location)
    {
        throw new NotImplementedException();
    }

    public Task<List<AirQualityPrediction>> GetLastWeekAirQualityFor(string location)
    {
        throw new NotImplementedException();
    }

    public Task<List<AirQualityPrediction>> GetTodayAirQualityFor(string location)
    {
        throw new NotImplementedException();
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