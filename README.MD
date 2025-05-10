## Production Environment Setup

For production, use the `docker-compose.prod.yml` file and the production Dockerfile.

### Steps:

1. **Clone the repository.**
2. **Ensure the `.env` file is correctly configured for production.**
3. **Run the following command:**

   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

4. **Access Services:**
   - Traefik dashboard: [http://traefik.localhost](http://traefik.localhost/) (secured with basic auth).
   - Swagger documentation for each service is available via Traefik on port 80 (e.g., http://traefik.localhost/api/auth/doc/).

---

## Scaling Services

Both development and production setups support scaling of services using Docker Compose's `--scale` flag. For example, to run two instances of each service in **development**:

```bash
docker compose up --build --scale the-service=2
```

For **production**, run:

```bash
docker-compose -f docker-compose.prod.yml up --build --scale the-service=2
```

This allows you to simulate a load-balanced, scalable microservices environment.

---

## Development Environment Setup

For development, use the `docker-compose.yml` file which includes live reload capabilities.

### Steps:

1. **Clone the repository.**
2. **Ensure the `.env` file is correctly configured for development.**
3. **Run the following command for live reload:**

   ```bash
   docker compose watch
   ```

4. **Access Services:**
   - Web service: [http://localhost](http://localhost/)
   - Navigation service: [http://navigation.localhost](http://navigation.localhost/)
   - Incident service: [http://incident.localhost](http://incident.localhost/)
   - User service: [http://user.localhost](http://user.localhost/)
   - Auth service: [http://auth.localhost](http://auth.localhost/)
   - Traefik dashboard: [http://localhost:8080](http://localhost:8080/) (as defined by HOST_PORT_TRAEFIK_DASHBOARD)

## Services Documentation

Trafine is a Waze-like navigation application built using a microservices architecture. Each service handles a specific aspect of the application:

### Backend Services

- **[Navigation Service](navigation-service/README.md)**: Handles route calculations, geocoding, and turn-by-turn directions.
- **[Incident Service](incident-service/README.md)**: Manages traffic incidents such as accidents, traffic jams, and road closures.
- **[Auth Service](auth-service/README.md)**: Handles user authentication and JWT token generation.
- **[User Service](user-service/README.md)**: Manages user accounts, profiles, and roles.

### Frontend

- **[Web service](http://localhost/)**: The main website for the application.

### Infrastructure

- **Traefik**: API Gateway and load balancer for routing requests to appropriate services.
- **MySQL**: Database for storing service data.

## Contributing

Please see our [Contributing Guide](CONTRIBUTING.md) for information on how to contribute to this project.
