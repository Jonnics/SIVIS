using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Adiciona suporte a controllers (API)
builder.Services.AddControllers();

// 2️⃣ Habilita CORS, caso queira testar localmente com fetch
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// 3️⃣ Middleware para arquivos estáticos
app.UseDefaultFiles(); // Procura index.html por padrão
app.UseStaticFiles();  // Serve CSS, JS, imagens, JSON

// 4️⃣ Habilita CORS
app.UseCors();

// 5️⃣ Mapear controllers (sua API de login AD)
app.MapControllers();

// 6️⃣ Roda a aplicação
app.Run();
