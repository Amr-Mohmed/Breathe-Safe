using web.Models;
using web.Models.enums;
using IRepository.Generic;
using IService;

namespace Services;


public class SubscriberService : ISubscriberService
{
    private readonly IRepository<Subscriber> _repository;

    public SubscriberService(IRepository<Subscriber> repository)
    {
        _repository = repository;
    }

    public async Task<Subscriber> AddSubscriber(Subscriber subscriber)
    {
        var subs = await _repository.CreateAsync(subscriber);
        return subs;
    }

    public async Task Notify(SubscriberType subscriberType)
    {
        var lst = await _repository.RetrieveAllAsync(subscriber => subscriber.SubscriberType == subscriberType);

        //code to notify them

    }

 
}