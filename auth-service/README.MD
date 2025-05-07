# Authentication Service

## Overview

The Authentication Service is responsible for handling authentication and token management in the Laynz application. This service:

- Authenticates users against the User Service
- Generates JWT (JSON Web Tokens) for authenticated users
- Handles secure password encryption/decryption
- Provides token-based authentication for other services

The Authentication Service functions as a gateway for authentication, working closely with the User Service to verify credentials and provide secure access tokens.

## Technologies

- .NET 8.0
- ASP.NET Web API
- JWT Authentication
- Microsoft.IdentityModel.Tokens
- Symmetric Key Encryption

## API Endpoints

### Auth Controller

#### `POST /auth`

Authenticates a user and provides a JWT token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**

- `200 OK`: Returns an `AuthDto` containing the JWT token and user information
- `404 Not Found`: Invalid credentials
- `500 Internal Server Error`: Server error with error message

**Response Schema (`AuthDto`):**

```json
{
  "token": "string",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "phoneNumber": "string",
    "role": "User|Admin"
  }
}
```

**Usage Example:**

```bash
curl -X POST http://auth.localhost/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

## Authentication Process

1. The client sends login credentials (email and password) to the `/auth` endpoint
2. The Authentication Service encrypts the password
3. The Authentication Service sends the email and encrypted password to the User Service's `/user/exist` endpoint
4. If credentials are valid, the User Service returns the user's information
5. The Authentication Service generates a JWT token containing the user's ID and role
6. The Authentication Service returns the token and user data to the client
7. The client includes this token in the `Authorization` header of subsequent requests

## Security Features

### JWT Token Generation

The service generates JWT tokens with the following claims:

- **NameIdentifier**: The user's unique ID
- **Role**: The user's role (User or Admin)

Tokens are configured with:

- Limited expiration time (1 hour)
- Signing with a symmetric security key
- Specified issuer and audience

### Password Encryption

The service implements symmetric encryption for passwords using AES:

- Passwords are encrypted before being sent to the User Service
- This provides an additional security layer beyond the transport-level encryption

## Configuration

The service requires the following configuration settings in `appsettings.json`:

- `Jwt:SecretKey`: Secret key for signing JWT tokens
- `Jwt:Issuer`: The issuer of the JWT token
- `Jwt:Audience`: The intended audience for the JWT token
- `Encryption:Key`: Key used for password encryption/decryption

## Development

To run the service locally:

```bash
cd auth-service
dotnet run
```

## Docker

The service can be containerized using the provided Dockerfile:

```bash
docker build -f Dockerfile.dev -t auth-service .
```

## API Documentation

**Swagger API URL:** [http://auth.localhost/swagger/index.html](http://auth.localhost/swagger/index.html)
