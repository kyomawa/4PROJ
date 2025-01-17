using navigation_service.Services.ItineraryService;
using navigation_service.Services.LocationService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddHttpClient<LocationService>();
builder.Services.AddHttpClient<ItineraryService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<InterfaceItineraryService, ItineraryService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
