# Incident Service

## Overview

The Incident Service is responsible for managing traffic incidents in the Laynz application. It handles:

- Creation of new incident reports (accidents, bottlenecks, closed roads, etc.)
- Retrieval of incidents within geographic areas
- User reactions to incidents (likes/dislikes) for validation
- Automatic cleanup of outdated incidents

This service maintains a database of user-reported traffic conditions that the navigation service uses to calculate optimal routes, avoiding problematic areas when possible.

## Technologies

- .NET 8.0
- ASP.NET Web API
- Entity Framework Core
- MySQL Database
- AutoMapper

## API Endpoints

### Incident Controller

#### `GET /incident`

Retrieves all incidents.

**Response:**

- `200 OK`: Returns a list of all `IncidentDto` objects
- `500 Internal Server Error`: Server error with error message

#### `GET /incident/bounding-box`

Retrieves incidents within a geographical bounding box.

**Query Parameters:**

- `minLat` (double, required): Minimum latitude bound
- `maxLat` (double, required): Maximum latitude bound
- `minLon` (double, required): Minimum longitude bound
- `maxLon` (double, required): Maximum longitude bound

**Response:**

- `200 OK`: Returns a list of `IncidentDto` objects within the specified bounds
- `500 Internal Server Error`: Server error with error message

#### `GET /incident/{id}`

Retrieves a specific incident by ID.

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Response:**

- `200 OK`: Returns the requested `IncidentDto`
- `404 Not Found`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

#### `POST /incident`

Creates a new incident report.

**Request Body:**

```json
{
  "type": "Crash|Bottling|ClosedRoad|PoliceControl|Obstacle",
  "longitude": 0.0,
  "latitude": 0.0
}
```

**Response:**

- `200 OK`: Returns the created `IncidentDto`
- `400 Bad Request`: Invalid incident type or coordinates
- `409 Conflict`: An incident of the same type already exists at these coordinates
- `500 Internal Server Error`: Server error with error message

#### `PUT /incident/{id}`

Updates an incident with a user reaction (like or dislike).

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Request Body:**

```json
{
  "reaction": "Like|Dislike"
}
```

**Response:**

- `200 OK`: Returns the updated `IncidentDto`
- `400 Bad Request`: Invalid reaction type
- `404 Not Found`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

#### `DELETE /incident/{id}`

Deletes an incident.

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Response:**

- `200 OK`: Returns the deleted `IncidentDto`
- `400 Bad Request`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

### Health Controller

#### `GET /health`

Checks the health of the service.

**Response:**

- `200 OK`: Returns a simple status message

## Data Models

### Incident

```csharp
public class Incident
{
    public Guid Id { get; init; }
    public IncidentType Type { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public int Like { get; set; }
    public int Dislike { get; set; }
    public DateTime CreationDate { get; init; }
}
```

### IncidentType (Enum)

```csharp
public enum IncidentType
{
    Crash,
    Bottling,
    ClosedRoad,
    PoliceControl,
    Obstacle
}
```

### ReactionType (Enum)

```csharp
public enum ReactionType
{
    Like,
    Dislike
}
```

## Architecture

### Repository Pattern

The service uses a repository pattern to abstract data access:

- **IIncidentRepository**: Interface defining data access methods
- **IncidentRepository**: Implementation for MySQL database

### Services

- **InterfaceIncidentService**: Defines business logic operations
- **IncidentService**: Implements business logic and coordinates with the repository

### Key Implementation Details

#### Geographic Bounding Box Queries

The service efficiently retrieves incidents within a geographic area using a bounding box approach:

```csharp
public async Task<List<Incident>> GetByBoundingBox(BoundingBoxDto boundingBox)
{
    var incidents = await context.Incidents
        .Where(i =>
            i.Latitude >= boundingBox.MinLat &&
            i.Latitude <= boundingBox.MaxLat &&
            i.Longitude >= boundingBox.MinLon &&
            i.Longitude <= boundingBox.MaxLon)
        .ToListAsync();

    return incidents;
}
```

This optimized query allows the navigation service to efficiently retrieve only the incidents that could affect a particular route.

#### Community Validation System

The service implements a community-based validation system for incidents:

```csharp
public async Task<Incident> AddLike(Incident incident)
{
    incident.Like++;
    await context.SaveChangesAsync();
    return incident;
}

public async Task<Incident> AddDislike(Incident incident)
{
    incident.Dislike++;
    await context.SaveChangesAsync();
    return incident;
}
```

This allows users to confirm or refute reported incidents, improving data reliability.

## Database

The service uses MySQL for data persistence with Entity Framework Core as the ORM. Migration scripts are automatically applied at startup if there are pending migrations.

### Schema

The database contains a single table `Incident` with the following structure:

- `Id` (GUID, Primary Key)
- `Type` (string, converted from enum)
- `Longitude` (double)
- `Latitude` (double)
- `Like` (int)
- `Dislike` (int)
- `CreationDate` (datetime)

## Configuration

The service requires the following environment variables:

- `MYSQL_DATABASE`: Name of the MySQL database
- `MYSQL_USER`: Username for database access
- `MYSQL_PASSWORD`: Password for database access

## Development

To run the service locally:

```bash
cd incident-service
dotnet run
```

## Docker

The service can be containerized using the provided Dockerfile:

```bash
docker build -f Dockerfile.dev -t incident-service .
```

## API Documentation

Swagger UI is available at `/swagger` when the service is running.

**URL** : [http://incident.localhost/swagger/index.html](http://incident.localhost/swagger/index.html)
