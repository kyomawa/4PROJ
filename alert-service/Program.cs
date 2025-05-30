using alert_service;
using alert_service.Hub;
using alert_service.Services.AlertService;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient();
builder.Services.AddScoped<IAlertService, AlertService>();
builder.Services.AddScoped<AlertHub>();

builder.Services.AddSignalR(options =>
{
    options.AddFilter<RateLimitHubFilter>();
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapHub<AlertHub>("/hub");
app.MapControllers();

app.Run();
