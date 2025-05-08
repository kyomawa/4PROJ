# Incident Service

## Overview

The Incident Service is responsible for managing traffic incidents in the Supmap application. It handles:

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

**Authentication:** Required (Admin role)

**Responses:**

- `200 OK`: Returns a list of all `IncidentDto` objects
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://incident.localhost/incident \
  -H "Authorization: Bearer {token}"
```

#### `GET /incident/active`

Retrieves all active incidents.

**Responses:**

- `200 OK`: Returns a list of all active `IncidentDto` objects
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://incident.localhost/incident/active
```

#### `GET /incident/bounding-box`

Retrieves incidents within a geographical bounding box.

**Query Parameters:**

- `minLat` (double, required): Minimum latitude bound
- `maxLat` (double, required): Maximum latitude bound
- `minLon` (double, required): Minimum longitude bound
- `maxLon` (double, required): Maximum longitude bound

**Responses:**

- `200 OK`: Returns a list of `IncidentDto` objects within the specified bounds
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET "http://incident.localhost/incident/bounding-box?minLat=45.7&maxLat=45.8&minLon=4.8&maxLon=4.9"
```

#### `GET /incident/{id}`

Retrieves a specific incident by ID.

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Responses:**

- `200 OK`: Returns the requested `IncidentDto`
- `404 Not Found`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://incident.localhost/incident/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

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

**Responses:**

- `200 OK`: Returns the created `IncidentDto`
- `400 Bad Request`: Invalid incident type or coordinates
- `409 Conflict`: An incident of the same type already exists at these coordinates
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X POST http://incident.localhost/incident \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Crash",
    "longitude": 4.8357,
    "latitude": 45.7640
  }'
```

#### `PUT /incident/{id}/vote`

Updates an incident with a user reaction (like or dislike).

**Authentication:** Required

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Request Body:**

```json
{
  "reaction": "Like|Dislike"
}
```

**Responses:**

- `200 OK`: Returns the updated `IncidentDto`
- `400 Bad Request`: Invalid reaction type
- `404 Not Found`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X PUT http://incident.localhost/incident/3fa85f64-5717-4562-b3fc-2c963f66afa6/vote \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reaction": "Like"
  }'
```

#### `PATCH /incident/{id}`

Updates incident information.

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Request Body:**

```json
{
  "type": "Crash|Bottling|ClosedRoad|PoliceControl|Obstacle",
  "longitude": 0.0,
  "latitude": 0.0,
  "status": "Active|Inactive"
}
```

**Responses:**

- `200 OK`: Returns the updated `IncidentDto`
- `400 Bad Request`: Invalid status type
- `404 Not Found`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X PATCH http://incident.localhost/incident/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Inactive"
  }'
```

#### `DELETE /incident/{id}`

Deletes an incident.

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Responses:**

- `200 OK`: Returns the deleted `IncidentDto`
- `400 Bad Request`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X DELETE http://incident.localhost/incident/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer {token}"
```

#### `PUT /incident/{id}/enable`

Enables an incident.

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Responses:**

- `200 OK`: Returns the enabled `IncidentDto`
- `400 Bad Request`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X PUT http://incident.localhost/incident/3fa85f64-5717-4562-b3fc-2c963f66afa6/enable \
  -H "Authorization: Bearer {token}"
```

#### `PUT /incident/{id}/disable`

Disables an incident.

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the incident

**Responses:**

- `200 OK`: Returns the disabled `IncidentDto`
- `400 Bad Request`: Incident with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X PUT http://incident.localhost/incident/3fa85f64-5717-4562-b3fc-2c963f66afa6/disable \
  -H "Authorization: Bearer {token}"
```

### Health Controller

#### `GET /health`

Checks the health of the service.

**Response:**

- `200 OK`: Returns a simple status message

**Usage Example:**

```bash
curl -X GET http://incident.localhost/health
```

## Data Models

### Incident

```csharp
public class Incident
{
    public Guid Id { get; init; }
    public IncidentType Type { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public IncidentStatus Status { get; set; }
    public DateTime CreationDate { get; init; }
    public ICollection<UserIncidentVote> Votes { get; set; }
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

### IncidentStatus (Enum)

```csharp
public enum IncidentStatus
{
    Active,
    Inactive
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

- **InterfaceIncidentRepository**: Interface defining data access methods
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
            i.Longitude <= boundingBox.MaxLon &&
            i.Status == IncidentStatus.Active)
        .Include(i => i.Votes)
        .ToListAsync();

    return incidents;
}
```

This optimized query allows the navigation service to efficiently retrieve only the incidents that could affect a particular route.

#### Community Validation System

The service implements a community-based validation system for incidents:

```csharp
public async Task<IncidentDto> Vote(Guid currentUserId, Guid id, VoteIncidentDto voteIncidentDto)
{
    var incident = await incidentRepository.Get(id);

    if (incident == null)
    {
        return null;
    }

    var userVote = await HandleUserVote(currentUserId, incident, voteIncidentDto.Reaction);
    var votesOnIncident = await incidentRepository.GetAllVotesOnIncident(incident);

    var totalLikes = votesOnIncident.Count(v => v.Reaction == ReactionType.Like);
    var totalDislikes = votesOnIncident.Count(v => v.Reaction == ReactionType.Dislike);

    if (totalDislikes >= totalLikes + MaxDislikesBeforeDelete)
    {
        incident = await incidentRepository.Disable(incident);
    }

    return mapper.Map<IncidentDto>(incident);
}
```

This allows users to confirm or refute reported incidents, improving data reliability.

## Database

The service uses MySQL for data persistence with Entity Framework Core as the ORM. Migration scripts are automatically applied at startup if there are pending migrations.

### Schema

The database contains two main tables:

#### `Incident` table with the following structure:

- `Id` (GUID, Primary Key)
- `Type` (string, converted from enum)
- `Longitude` (double)
- `Latitude` (double)
- `Status` (string, converted from enum)
- `CreationDate` (datetime)

#### `UserIncidentVotes` table with the following structure:

- `Id` (GUID, Primary Key)
- `IncidentId` (GUID, Foreign Key)
- `UserId` (GUID)
- `Reaction` (int)

## Configuration

The service requires the following environment variables:

- `INCIDENT_DB`: Name of the MySQL database
- `INCIDENT_DB_USER`: Username for database access
- `INCIDENT_DB_PSW`: Password for database access

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

**Swagger API URL:** [http://incident.localhost/swagger/index.html](http://incident.localhost/swagger/index.html)
