using incident_service.Contexts;
using incident_service.Repository;
using incident_service.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("ProdConnection");

var mysqlDatabase = Environment.GetEnvironmentVariable("INCIDENT_DB");
var mysqlUser = Environment.GetEnvironmentVariable("INCIDENT_DB_USER");
var mysqlPassword = Environment.GetEnvironmentVariable("INCIDENT_DB_PSW");

if (string.IsNullOrEmpty(mysqlDatabase) || string.IsNullOrEmpty(mysqlUser) || string.IsNullOrEmpty(mysqlPassword))
{
    throw new InvalidOperationException("Error when loading environment variable related to DB");
}

connectionString = connectionString
    .Replace("${INCIDENT_DB}", mysqlDatabase)
    .Replace("${INCIDENT_DB_USER}", mysqlUser)
    .Replace("${INCIDENT_DB_PSW}", mysqlPassword);

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
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
