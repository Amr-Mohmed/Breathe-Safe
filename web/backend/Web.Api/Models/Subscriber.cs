namespace CleanAirApp.Models
{
    // Subscriber class (stakeholder)
    public class Subscriber
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Unique ID
        public string Name { get; set; }               // Organization / person
        public SubscriberType Type { get; set; }       // Stakeholder category
        public string ContactInfo { get; set; }        // Email/Phone/Other
        public string Region { get; set; }             // Area of interest (city, zone, lat/lon)

        public override string ToString()
        {
            return $"{Name} ({Type}) - Region: {Region}";
        }
    }
}
