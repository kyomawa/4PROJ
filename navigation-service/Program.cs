using Microsoft.EntityFrameworkCore;
using navigation_service.Contexts;
using navigation_service.Services.ItineraryService;
using navigation_service.Services.LocationService;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("ProdConnection");

var mysqlDatabase = Environment.GetEnvironmentVariable("NAV_DB");
var mysqlUser = Environment.GetEnvironmentVariable("NAV_DB_USER");
var mysqlPassword = Environment.GetEnvironmentVariable("NAV_DB_PSW");

if (string.IsNullOrEmpty(mysqlDatabase) || string.IsNullOrEmpty(mysqlUser) || string.IsNullOrEmpty(mysqlPassword))
{
    throw new InvalidOperationException("Error when loading environment variable related to DB");
}

connectionString = connectionString
    .Replace("${MYSQL_DATABASE}", mysqlDatabase)
    .Replace("${MYSQL_USER}", mysqlUser)
    .Replace("${MYSQL_PASSWORD}", mysqlPassword);


builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// Add services to the container.
builder.Configuration.AddEnvironmentVariables();
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
