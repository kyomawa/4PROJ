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
