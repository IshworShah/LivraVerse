using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Middleware;
using BookStore_Backend.Model;
using BookStore_Backend.Services;
using BookStore_Backend.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    options.JsonSerializerOptions.WriteIndented = true;
}); ;
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

builder.Services.AddCors(opt => opt.AddPolicy(name: "AllowFrontend", builder =>
{
    builder.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175").AllowAnyHeader().AllowAnyMethod(); ;

}));



builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(HttpContext =>
    RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: HttpContext.Connection?.RemoteIpAddress!.ToString()!, 
        factory: partition =>  new FixedWindowRateLimiterOptions
    {
        PermitLimit = 100,
        Window = TimeSpan.FromMinutes(1)

    }
    )
    );




    options.AddPolicy("login", HttpContext => RateLimitPartition.GetFixedWindowLimiter(partitionKey: HttpContext.Connection.RemoteIpAddress, factory: partition => new FixedWindowRateLimiterOptions
    {
        PermitLimit = 6,
        Window = TimeSpan.FromMinutes(1)

    })
    );

   

    options.AddPolicy("checkout", HttpContext => RateLimitPartition.GetFixedWindowLimiter(partitionKey: HttpContext.Connection.RemoteIpAddress, factory: partition => new FixedWindowRateLimiterOptions
    {
        PermitLimit = 10,
        Window = TimeSpan.FromMinutes(1),
        QueueProcessingOrder=QueueProcessingOrder.OldestFirst
        

    })

  );

});


    builder.Services.AddDbContext<AppDbContext>(option =>
    {
        var connectionKey = builder.Configuration.GetConnectionString("ConnectionKey");

        option.UseSqlServer(connectionString: connectionKey);

    });


    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(option =>
    {
        var SecureKey = builder.Configuration.GetValue<String>("Jwt:SecretKey");
        var issuer = builder.Configuration.GetValue<String>("Jwt:Issuer");
        var Audience = builder.Configuration.GetValue<String>("Jwt:Audience");

        option.TokenValidationParameters = new TokenValidationParameters
        {

            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecureKey!))

        };
    });

    //configuring emailService class to Map with json on jsonAppSetting
    //nameof return string name of class 
    builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection(nameof(EmailSettings)));
    builder.Services.AddHttpContextAccessor();


    builder.Services.AddScoped<IAuthenticationServices, IAuthenticationServicesImplementation>();
    builder.Services.AddScoped<IBookServices, IBookServicesImplementation>();
    builder.Services.AddScoped<IStaffService, IstaffServiceImplementation>();
    builder.Services.AddScoped<IWishlistServices, IWishlistServicesImplementation>();
    builder.Services.AddScoped<ICartServices, ICartServicesImplementation>();
    builder.Services.AddScoped<IOrderServices, IOrderServicesImplementation>();
    builder.Services.AddScoped<IEmailServices, IEmailServiceImplementation>();
    builder.Services.AddScoped<IAnnouncementService, IAnnouncementServiceImplementation>();
    builder.Services.AddScoped<IUserServices, IUserServicesImplementation>();
    builder.Services.AddSingleton<ConnectedUserTracker>();


    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseCors("AllowFrontend");


    app.UseRateLimiter();
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
app.UseAuthorization();
    app.UseStaticFiles();
    app.MapControllers();
    app.MapHub<Notification>("/notifications");


app.Run();
