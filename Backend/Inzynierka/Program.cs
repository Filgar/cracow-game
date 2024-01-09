using Inzynierka;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?.Replace("{user}", Environment.GetEnvironmentVariable("DB_USER"))
    .Replace("{password}", Environment.GetEnvironmentVariable("DB_PASSWORD"));

builder.Services.AddDbContext<DbConnector>(options => options.UseNpgsql(connectionString, x => x.UseNetTopologySuite()));
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString;
    options.SerializerOptions.Converters.Add(new NetTopologySuite.IO.Converters.GeoJsonConverterFactory());
});

builder.Services.AddCors(options => options.AddDefaultPolicy(b =>
{
    b.WithOrigins(builder.Configuration.GetValue<string>("CorsAllowedOrigins")!.Split(";")); ;
    b.WithMethods(builder.Configuration.GetValue<string>("CorsAllowedMethods")!);
    b.WithHeaders(builder.Configuration.GetValue<string>("CorsHeaders")!);
}));

var app = builder.Build();
app.UseCors(
    //builder => builder.AllowAnyOrigin()
    );

app.MapGet("/urbanObjects", async (int amount, [FromQuery(Name = "forbiddenIds[]")] int[] forbiddenIds, [FromQuery(Name = "allowedTypes[]")] string[] allowedTypes, int allowedDistricts, DbConnector db) =>
{
    var indexes = ObjectsSelector.GetRandomIds(db.UrbanObjects, amount, forbiddenIds, allowedTypes, allowedDistricts);
    var result = await db.UrbanObjects.Where(x => indexes.Contains(x.Id)).ToListAsync();
    return Results.Ok(result);
});

app.MapGet("/types", async (DbConnector db) => Results.Ok(await db.UrbanObjects.GroupBy(x => x.Type).Select(x => x.First().Type).ToListAsync()));
app.MapGet("/districts", async (DbConnector db) => Results.Ok(await db.Districts.Select(x => new { x.Name, x.Value }).ToListAsync()));


app.Run();
