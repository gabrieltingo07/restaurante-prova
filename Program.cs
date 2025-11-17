using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// =====================
//        CORS
// =====================
var myCorsPolicy = "_myCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myCorsPolicy, policy =>
    {
        policy
            .AllowAnyOrigin()   // Em produção idealmente trocar por origins específicos
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


//Controllers

builder.Services.AddControllers();


//Build app

var app = builder.Build();


//Pipeline correto


//Serve arquivos estáticos (HTML, JS, CSS)

app.UseStaticFiles();

//Cria o pipeline de roteamento
app.UseRouting();

//Habilita CORS (antes do MapControllers)
app.UseCors(myCorsPolicy);

//Autorização (se houver) — pode ser removido se não usar auth
app.UseAuthorization();

//Mapeia os endpoints da API
app.MapControllers();

//Fallback para SPA — precisa vir DEPOIS do MapControllers
app.MapFallbackToFile("index.html");

//Inicia servidor
app.Run();
