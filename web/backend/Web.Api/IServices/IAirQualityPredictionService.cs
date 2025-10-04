using web.Models;
using web.Models.Dtos;

namespace IService;

public interface IAirQualityPredictionService
{
    Task<List<AirQualityPrediction>> GetTodayAirQualityFor(string location);
    Task<List<AirQualityPrediction>> GetLastWeekAirQualityFor(string location);
    Task<List<AirQualityPrediction>> GetLastMonthAirQualityFor(string location);

    Task<AirQualityPrediction> AddAirQualityData(AirQualityPrediction airQualityPrediction);
    Task<AirQualityPrediction> GetAirQualityPredictionsAsync(AirQualityRequest request);

}