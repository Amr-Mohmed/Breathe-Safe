using DataConfiguration;
using IRepository.Generic;
using IService;
using Microsoft.EntityFrameworkCore;
using Repositories.Generic;
using Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddScoped<IAirQualityPredictionService, AirQualityPredictionSerivce>();
builder.Services.AddScoped<ISubscriberService, SubscriberService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("default")));

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
