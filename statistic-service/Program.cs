using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using statistic_service.Contexts;
using statistic_service.Repositories.IncidentRepository;
using statistic_service.Repositories.UserRepository;
using statistic_service.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var userDbConnectionString = builder.Configuration.GetConnectionString("UserConnection");
var incidentDbConnectionString = builder.Configuration.GetConnectionString("IncidentConnection");

var userDb = Environment.GetEnvironmentVariable("USER_DB");
var userDbUser = Environment.GetEnvironmentVariable("USER_DB_USER");
var userDbPassword = Environment.GetEnvironmentVariable("USER_DB_PSW");

var incidentDb = Environment.GetEnvironmentVariable("INCIDENT_DB");
var incidentDbUser = Environment.GetEnvironmentVariable("INCIDENT_DB_USER");
var incidentDbPassword = Environment.GetEnvironmentVariable("INCIDENT_DB_PSW");

if (string.IsNullOrEmpty(userDb) || string.IsNullOrEmpty(userDbUser) || string.IsNullOrEmpty(userDbPassword) || string.IsNullOrEmpty(incidentDb) || string.IsNullOrEmpty(incidentDbUser) || string.IsNullOrEmpty(incidentDbPassword))
{
    throw new InvalidOperationException("Error when loading environment variable related to databases");
}

userDbConnectionString = userDbConnectionString
    .Replace("${USER_DB}", userDb)
    .Replace("${USER_DB_USER}", userDbUser)
    .Replace("${USER_DB_PSW}", userDbPassword);

incidentDbConnectionString = incidentDbConnectionString
    .Replace("${INCIDENT_DB}", incidentDb)
    .Replace("${INCIDENT_DB_USER}", incidentDbUser)
    .Replace("${INCIDENT_DB_PSW}", incidentDbPassword);

builder.Services.AddDbContext<UserContext>(options =>
    options.UseMySql(userDbConnectionString, ServerVersion.AutoDetect(userDbConnectionString))
);
builder.Services.AddDbContext<IncidentContext>(options =>
    options.UseMySql(incidentDbConnectionString, ServerVersion.AutoDetect(incidentDbConnectionString))
);

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

builder.Services.AddAuthorization();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<InterfaceIncidentRepository, IncidentRepository>();
builder.Services.AddScoped<IStatisticService, StatisticService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
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
