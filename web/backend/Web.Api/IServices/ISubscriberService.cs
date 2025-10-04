using web.Models;
using web.Models.enums;

namespace IService;


public interface ISubscriberService
{
    Task<Subscriber> AddSubscriber(Subscriber subscriber);
    Task Notify(SubscriberType subscriberType);
}
