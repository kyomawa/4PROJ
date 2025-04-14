FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

USER root
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

USER app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["incident-service.csproj", "./"]
RUN dotnet restore "./incident-service.csproj"

COPY . .
RUN dotnet build "incident-service.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "incident-service.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "incident-service.dll"]