namespace CleanAirApp.Models
{
    // Air quality prediction model result
    public class AirQualityPrediction
    {
        public Guid Id { get; set; } = Guid.NewGuid(); 
        public DateTime PredictionDate { get; set; }   // When the prediction applies
        public string Region { get; set; }             // Region/location of prediction
        public double AQI { get; set; }                // Air Quality Index
        public string Category { get; set; }           // e.g., Good, Moderate, Unhealthy
        public string MainPollutant { get; set; }      // e.g., NO2, O3, PM2.5, CO
        public string SourceModel { get; set; }        // AI model/team member identifier
        public string AdvisoryMessage { get; set; }    // Human-readable message for stakeholders
    }
}
