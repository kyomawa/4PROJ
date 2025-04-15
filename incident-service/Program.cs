using incident_service.Contexts;
using incident_service.Repository;
using incident_service.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("ProdConnection");

var mysqlDatabase = Environment.GetEnvironmentVariable("MYSQL_DATABASE");
var mysqlUser = Environment.GetEnvironmentVariable("MYSQL_USER");
var mysqlPassword = Environment.GetEnvironmentVariable("MYSQL_PASSWORD");

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
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://logto.localhost/oidc";
        options.Audience = "incident-service";              
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddAuthorization();
builder.Services.AddHttpClient();

builder.Services.AddScoped<InterfaceIncidentService, IncidentService>();
builder.Services.AddScoped<InterfaceIncidentRepository, IncidentRepository>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
}

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
