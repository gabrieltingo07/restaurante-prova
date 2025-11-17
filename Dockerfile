# --- Imagem de build (SDK) ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Pasta de trabalho dentro do container
WORKDIR /src

# Copia tudo do projeto para dentro do container
COPY . .

# Restaura os pacotes do projeto específico
RUN dotnet restore "RestauranteProva.csproj"

# Publica o projeto em modo Release para a pasta /app
RUN dotnet publish "RestauranteProva.csproj" -c Release -o /app

# --- Imagem final (runtime) ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

# Copia os arquivos publicados da imagem de build
COPY --from=build /app .

# (Opcional) expor porta, se quiser
EXPOSE 8080

# Sobe a aplicação
ENTRYPOINT ["dotnet", "RestauranteProva.dll"]
