using Microsoft.EntityFrameworkCore;
using user_service.Contexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using user_service.Repositories;
using user_service.Services.EncryptionService;
using user_service.Services.UserService;
using Microsoft.AspNetCore.Identity;
using user_service.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("ProdConnection");

var mysqlDatabase = Environment.GetEnvironmentVariable("USER_DB");
var mysqlUser = Environment.GetEnvironmentVariable("USER_DB_USER");
var mysqlPassword = Environment.GetEnvironmentVariable("USER_DB_PSW");

if (string.IsNullOrEmpty(mysqlDatabase) || string.IsNullOrEmpty(mysqlUser) || string.IsNullOrEmpty(mysqlPassword))
{
    throw new InvalidOperationException("Error when loading environment variable related to DB");
}

connectionString = connectionString
    .Replace("${USER_DB}", mysqlDatabase)
    .Replace("${USER_DB_USER}", mysqlUser)
    .Replace("${USER_DB_PSW}", mysqlPassword);

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }

    var adminEmail = "admin@admin.com";
    var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);

    if (adminUser == null)
    {
        adminUser = new User
        {
            Username = "Admin123",
            Email = adminEmail,
            Password = BCrypt.Net.BCrypt.HashPassword("admin"),
            Role = UserRole.Admin,
            PhoneNumber = "0602010304"
        };

        context.Users.Add(adminUser);
        await context.SaveChangesAsync();
    }
}

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
