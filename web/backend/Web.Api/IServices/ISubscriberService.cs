using web.Models;

namespace IService;


public interface ISubscriberService
{
    Task<Subscriber> AddSubscriber(Subscriber subscriber);
    Task Notify();
}
