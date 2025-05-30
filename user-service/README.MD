# User Service

## Overview

The User Service manages all user-related operations in the Supmap application, including:

- User registration and account management
- User profile information storage and retrieval
- User authentication verification (working with Auth Service)
- Role-based access control (admin vs. regular users)
- Secure password storage using BCrypt

This service maintains the core user database and handles operations related to creating, retrieving, updating, and deleting user accounts.

## Technologies

- .NET 8.0
- ASP.NET Web API
- Entity Framework Core
- MySQL Database
- JWT Authentication integration
- BCrypt.Net for password hashing
- AutoMapper

## API Endpoints

### User Controller

#### `GET /user`

Retrieves all users (admin only).

**Authentication:** Required (Admin role)

**Responses:**

- `200 OK`: Returns a list of all `UserDto` objects
- `401 Unauthorized`: User is not authenticated
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://user.localhost/user \
  -H "Authorization: Bearer {token}"
```

#### `GET /user/{id}`

Retrieves a specific user by ID.

**Authentication:** Required (Admin or Owner of the account)

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the user

**Responses:**

- `200 OK`: Returns the requested `UserDto`
- `400 Bad Request`: User with the specified ID was not found
- `401 Unauthorized`: User is not authenticated
- `403 Forbidden`: User is not authorized to access this resource
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://user.localhost/user/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer {token}"
```

#### `POST /user`

Creates a new user account.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "phoneNumber": "string"
}
```

**Responses:**

- `200 OK`: Returns the created `UserDto`
- `409 Conflict`: A user with this email already exists
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X POST http://user.localhost/user \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jdupont",
    "email": "john.doe@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "phoneNumber": "0601020304"
  }'
```

#### `POST /user/exist`

Verifies if a user exists and validates credentials.

**Request Body:**

```json
{
  "email": "string",
  "encryptedPassword": "string"
}
```

**Responses:**

- `200 OK`: Returns the corresponding `UserDto` if credentials are valid
- `404 Not Found`: User not found or credentials invalid
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X POST http://user.localhost/user/exist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "encryptedPassword": "ciphertext_here"
  }'
```

#### `PUT /grant/{email}`

Grants admin role to a user (admin only).

**Authentication:** Required (Admin role)

**Path Parameters:**

- `email` (string, required): The email of the user to promote

**Responses:**

- `200 OK`: Returns the updated `UserDto`
- `404 Not Found`: User with the specified email was not found
- `401 Unauthorized`: User is not authenticated
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X PUT http://user.localhost/grant/john.doe@example.com \
  -H "Authorization: Bearer {token}"
```

#### `PUT /user/{id}`

Updates a user's profile information.

**Authentication:** Required (Admin or Owner of the account)

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the user

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "phoneNumber": "string",
  "currentPassword": "string"
}
```

**Responses:**

- `200 OK`: Returns the updated `UserDto`
- `401 Unauthorized`: Current password is incorrect or user is not authenticated
- `403 Forbidden`: User is not authorized to update this account
- `404 Not Found`: User with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X PUT http://user.localhost/user/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "phoneNumber": "0601020304",
    "currentPassword": "Password123!"
  }'
```

#### `DELETE /user/{id}`

Deletes a user account.

**Authentication:** Required (Admin or Owner of the account)

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the user

**Responses:**

- `200 OK`: Returns the deleted `UserDto`
- `404 Not Found`: User with the specified ID was not found
- `401 Unauthorized`: User is not authenticated
- `403 Forbidden`: User is not authorized to delete this account
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X DELETE http://user.localhost/user/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer {token}"
```

### Health Controller

#### `GET /health`

Checks the health status of the service.

**Responses:**

- `200 OK`: Returns a simple status message indicating the service is healthy

**Usage Example:**

```bash
curl -X GET http://user.localhost/health
```

**Response:**

```json
{
  "status": "healthy"
}
```

## Data Models

### User

```csharp
public class User
{
    public Guid Id { get; init; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Password { get; set; }
    public DateTime CreationDate { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
}
```

### UserRole (Enum)

```csharp
public enum UserRole
{
    User,
    Admin
}
```

## Architecture

### Repository Pattern

The service uses a repository pattern to abstract data access:

- **IUserRepository**: Interface defining data access methods
- **UserRepository**: Implementation for MySQL database

### Services

- **IUserService**: Defines business logic operations
- **UserService**: Implements business logic and coordinates with the repository
- **IEncryptionService**: Defines encryption-related operations
- **EncryptionService**: Implements encryption and decryption functionality

### Special Features

#### AdminOrOwner Attribute

A custom authorization attribute (`AdminOrOwnerAttribute`) that ensures endpoints can only be accessed by:

- Users with the Admin role, or
- The user who owns the account being manipulated

```csharp
public class AdminOrOwnerAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var currentUserRole = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        var currentUserId = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var userId = context.RouteData.Values["id"]?.ToString();

        if (currentUserRole != "Admin" && currentUserId != userId)
        {
            context.Result = new ForbidResult();
        }
    }
}
```

#### Secure Password Handling

The service uses BCrypt for secure password hashing:

```csharp
// When creating a user
user.Password = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);

// When verifying a password
BCrypt.Net.BCrypt.Verify(password, user.Password);
```

This provides strong protection against password compromise, even if the database is breached.

## Database

The service uses MySQL for data persistence with Entity Framework Core as the ORM. Migration scripts are automatically applied at startup if there are pending migrations.

### Schema

The database contains a single table `Users` with the following structure:

- `Id` (GUID, Primary Key)
- `Username` (string)
- `Email` (string)
- `PhoneNumber` (string)
- `Password` (string, BCrypt hashed)
- `CreationDate` (datetime)
- `Role` (string, converted from enum)

## Configuration

The service requires the following environment variables:

- `USER_DB`: Name of the MySQL database
- `USER_DB_USER`: Username for database access
- `USER_DB_PSW`: Password for database access

Additional configuration items:

- `JWT` settings for token validation
- `Encryption` key for password encryption/decryption

## Development

To run the service locally:

```bash
cd user-service
dotnet run
```

## Docker

The service can be containerized using the provided Dockerfile:

```bash
docker build -f Dockerfile.dev -t user-service .
```

## API Documentation

**Swagger API URL:** [http://user.localhost/swagger/index.html](http://user.localhost/swagger/index.html)
