# Supmap - Real-time Navigation Application

Supmap (Trafine) is a real-time navigation application built with a microservices architecture, providing traffic information, incident reporting, and route optimization.

## Production Environment Setup

To run the entire system in production mode, follow these steps:

### Prerequisites

- Docker and Docker Compose installed
- A mobile device with Expo Go app installed (for mobile app access)
- Mobile device and host machine on the same Wi-Fi network

### Configuration

1. **Clone the repository**

   ```bash
   git clone https://github.com/kyomawa/4PROJ.git
   cd 4PROJ
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env # Dont do it if you already have .env file
   ```

   Edit the `.env` file and configure all required variables. **Critical configuration:**

   - **Set `EXPO_PUBLIC_API_BASE_URL` to your machine's IPv4 address** (not `localhost`)

     ```
     EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10  # Replace with your actual IPV4
     ```

   To find your IP address:

   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig` or `ip addr`

   ⚠️ **Important:** The mobile app will NOT work if you use `localhost` or `127.0.0.1`

3. **Start the production environment**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

### Accessing the Mobile App

1. **Ensure network connectivity**

   - Your mobile device MUST be on the same Wi-Fi network as the host machine
   - The network must allow LAN communication (some corporate/public networks restrict this)

2. **Launch the mobile app**

   - Install the **Expo Go** app on your mobile device
   - Check the logs of the `mobile-app-service` container:

     ```bash
     docker logs -f supmap-mobile-app-service-1
     ```

   - Scan the QR code displayed in the logs using the Expo Go app
   - Alternatively, use the tunnel URL provided in the logs

### Service Access Points

Once running, you can access the following services:

- **Website**: [http://localhost](http://localhost)
- **Traefik Dashboard**: [http://traefik.localhost](http://traefik.localhost) (requires authentication)
- **API Endpoints**: Available through `/api/{service-name}` routes

### Service Documentation

For detailed information about each service, refer to their individual READMEs:

- **[Alert Service](alert-service/README.MD)** - Real-time traffic alerts using SignalR
- **[Auth Service](auth-service/README.MD)** - User authentication and JWT token management
- **[Incident Service](incident-service/README.MD)** - Traffic incident reporting and management
- **[Navigation Service](navigation-service/README.MD)** - Route calculation and optimization
- **[Statistics Service](statistic-service/README.MD)** - Analytics and reporting
- **[User Service](user-service/README.MD)** - User account management
- **[Website Service](website-service/README.md)** - Web frontend application
- **[Mobile App Service](mobile-app-service/README.MD)** - React Native mobile application

## Development Environment Setup

For development with live reload capabilities:

1. **Configure environment variables** (same as production setup)

2. **Run with watch mode**

   ```bash
   docker compose watch
   ```

   Or without watch mode:

   ```bash
   docker compose up --build
   ```

3. **Access services in development**
   - Web service: [http://localhost](http://localhost)
   - Navigation service: [http://navigation.localhost](http://navigation.localhost)
   - Incident service: [http://incident.localhost](http://incident.localhost)
   - User service: [http://user.localhost](http://user.localhost)
   - Auth service: [http://auth.localhost](http://auth.localhost)
   - Alert service: [http://alert.localhost](http://alert.localhost)
   - Statistics service: [http://statistics.localhost](http://statistics.localhost)
   - Traefik dashboard: [http://localhost:8080](http://localhost:8080)

## Troubleshooting

### Mobile App Connection Issues

1. **Network Configuration**

   - Verify both devices are on the same Wi-Fi network
   - Check that your firewall allows connections on ports 19000, 19001, and 8081
   - Ensure the network doesn't block LAN communication

2. **IP Address Issues**

   - Double-check that `EXPO_PUBLIC_API_BASE_URL` contains your correct IPv4 address
   - Restart the mobile-app-service after changing the IP address
   - Try using the tunnel option in Expo if direct connection fails

3. **Container Issues**
   - Check container logs: `docker logs supmap-mobile-app-service-1`
   - Ensure all services are healthy: `docker ps`
   - Restart specific services if needed

4. ** Inability to interact with API (cannot login/create account or get itinerary) on mobile app in production
   - Replace line ```CMD ["npx", "expo", "start", "--tunnel", "--no-dev", "--minify"]``` by ```CMD ["npx", "expo", "start", "--tunnel"]``` in Dockerfile

## Architecture Overview

Supmap is built using a microservices architecture with the following components:

- **Backend Services**: .NET 8.0 microservices handling specific business domains
- **Frontend**: Next.js web application and React Native mobile app
- **Infrastructure**: Traefik for API gateway and routing, MySQL for data persistence
- **Communication**: REST APIs, SignalR for real-time updates

## Scaling Services

Both development and production setups support service scaling:

```bash
# Production
docker-compose -f docker-compose.prod.yml up --build --scale navigation-service=2

# Development
docker compose up --build --scale navigation-service=2
```
