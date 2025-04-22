using Microsoft.EntityFrameworkCore;
using navigation_service.Contexts;
using navigation_service.Services.ItineraryService;
using navigation_service.Services.LocationService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using navigation_service.Repositories.ItineraryRepository;

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
    .Replace("${NAV_DB}", mysqlDatabase)
    .Replace("${NAV_DB_USER}", mysqlUser)
    .Replace("${NAV_DB_PSW}", mysqlPassword);


builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

builder.Configuration.AddEnvironmentVariables();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://auth-service:8080";
        options.Audience = builder.Configuration["Jwt:Audience"];
        options.IncludeErrorDetails = true;

        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "http://auth-service:8080",

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"])
            ),
            ValidateLifetime = true,
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddHttpClient<LocationService>();
builder.Services.AddHttpClient<ItineraryService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<InterfaceItineraryRepository,  ItineraryRepository>();
builder.Services.AddScoped<InterfaceItineraryService, ItineraryService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
