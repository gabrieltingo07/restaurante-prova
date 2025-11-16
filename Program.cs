using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

var myCorsPolicy = "_myCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myCorsPolicy, policy =>
    {
        policy
            .AllowAnyOrigin()   // LIBERA SÓ EM DESENVOLVIMENTO
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

//Serviços

builder.Services.AddControllers();

//Constrói o App.

var app = builder.Build();

app.UseCors(myCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
