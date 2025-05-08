# Navigation Service

## Overview

The Navigation Service is a core component of the Supmap application, responsible for handling navigation-related functionality including:

- Route calculation between points with real-time traffic consideration
- Location geocoding (converting text addresses to geographic coordinates)
- Providing itinerary details with step-by-step directions
- Avoiding areas with reported incidents
- Managing different travel modes and route types
- Saving and sharing itineraries

## Technologies

- .NET 8.0
- ASP.NET Web API
- AutoMapper
- Entity Framework Core
- External API integrations (TomTom API, Geoapify API)

## API Endpoints

### Location Controller

#### `GET /location`

Converts text locations to geographic coordinates.

**Query Parameters:**

- `textLocation` (string, required): The address or location text to geocode

**Responses:**

- `200 OK`: Returns a list of `LocationDto` objects matching the query
- `404 Not Found`: No data found for the location
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET "http://navigation.localhost/location?textLocation=Lyon%20France"
```

**Response Schema (`LocationDto`):**

```json
{
  "placeId": "string",
  "latitude": 0.0,
  "longitude": 0.0,
  "formatted": "string",
  "wayNumber": "string",
  "street": "string",
  "postalCode": "string",
  "city": "string",
  "borough": "string",
  "area": "string",
  "country": "string",
  "boundingBox": [0.0, 0.0, 0.0, 0.0]
}
```

### Itinerary Controller

#### `GET /itinerary`

Retrieves all itineraries saved by the user.

**Authentication:** Required

**Responses:**

- `200 OK`: Returns a `UserItineraryDto` object with the saved itineraries
- `401 Unauthorized`: Invalid or missing user ID
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://navigation.localhost/itinerary \
  -H "Authorization: Bearer {token}"
```

#### `GET /itinerary/{id}`

Retrieves a specific itinerary by ID.

**Authentication:** Required

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the itinerary

**Responses:**

- `200 OK`: Returns a `SavedItineraryDto` object with itinerary details
- `401 Unauthorized`: Invalid or missing user ID
- `403 Forbidden`: User does not have access to this itinerary
- `404 Not Found`: Itinerary with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://navigation.localhost/itinerary/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer {token}"
```

#### `POST /itinerary/save`

Saves a new itinerary for the user.

**Authentication:** Required

**Request Body:**

```json
{
  "departure": "string",
  "departureLon": 0.0,
  "departureLat": 0.0,
  "arrival": "string",
  "arrivalLon": 0.0,
  "arrivalLat": 0.0,
  "travelMode": "string",
  "distance": 0.0,
  "duration": 0.0
}
```

**Responses:**

- `200 OK`: Returns the created `SavedItineraryDto` object
- `401 Unauthorized`: Invalid or missing user ID
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X POST http://navigation.localhost/itinerary/save \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "departure": "Lyon",
    "departureLon": 4.8357,
    "departureLat": 45.7640,
    "arrival": "Paris",
    "arrivalLon": 2.3522,
    "arrivalLat": 48.8566,
    "travelMode": "car",
    "distance": 463000,
    "duration": 15600
  }'
```

#### `DELETE /itinerary/{id}`

Deletes a saved itinerary.

**Authentication:** Required

**Path Parameters:**

- `id` (GUID, required): The unique identifier of the itinerary

**Responses:**

- `200 OK`: Returns the deleted `SavedItineraryDto` object
- `401 Unauthorized`: Invalid or missing user ID
- `403 Forbidden`: User does not have access to this itinerary
- `404 Not Found`: Itinerary with the specified ID was not found
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X DELETE http://navigation.localhost/itinerary/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer {token}"
```

#### `GET /itinerary/calculate`

Calculates an itinerary between two points.

**Query Parameters:**

- `departureLat` (double, required): Departure latitude
- `departureLon` (double, required): Departure longitude
- `arrivalLat` (double, required): Arrival latitude
- `arrivalLon` (double, required): Arrival longitude
- `travelMethod` (string, required): Transport method ('car', 'bike', 'foot', or 'train')
- `routeType` (string, required): Type of route ('fastest', 'shortest', 'eco', or 'thrilling')
- `avoidTollRoads` (bool, required): Avoid toll roads

**Responses:**

- `200 OK`: Returns an `ItineraryDto` object with the calculated route
- `400 Bad Request`: Invalid parameters or points
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET "http://navigation.localhost/itinerary/calculate?departureLat=45.7640&departureLon=4.8357&arrivalLat=48.8566&arrivalLon=2.3522&travelMethod=car&routeType=fastest&avoidTollRoads=false"
```

**Response Schema (`ItineraryDto`):**

```json
{
  "travelMode": "string",
  "distance": 0.0,
  "duration": 0.0,
  "steps": [
    {
      "distance": 0.0,
      "duration": 0.0,
      "instruction": "string",
      "type": "string",
      "wayPoints": {
        "latitude": 0.0,
        "longitude": 0.0
      }
    }
  ],
  "coordinates": [
    {
      "latitude": 0.0,
      "longitude": 0.0
    }
  ],
  "incidents": [
    {
      "id": "uuid",
      "type": "string",
      "longitude": 0.0,
      "latitude": 0.0,
      "status": "string",
      "creationDate": "2023-01-01T00:00:00Z",
      "votes": []
    }
  ],
  "boundingBox": {
    "minLat": 0.0,
    "maxLat": 0.0,
    "minLon": 0.0,
    "maxLon": 0.0
  }
}
```

### Health Controller

#### `GET /health`

Checks the health of the service.

**Response:**

- `200 OK`: Returns a simple status message

**Usage Example:**

```bash
curl -X GET http://navigation.localhost/health
```

## Architecture

### Services

- **LocationService**: Converts text locations to geographic coordinates using the Geoapify API
- **ItineraryService**: Calculates routes between points using the TomTom API and handles incident avoidance

### Data Transfer Objects (DTOs)

- **LocationDto**: Represents a geocoded location with address details
- **ItineraryDTO**: Contains route information including distance, duration, steps, and coordinates
- **CoordinateDto**: Represents a geographic point with latitude and longitude
- **StepDto**: Represents a single navigation instruction in the route
- **IncidentDto**: Contains information about traffic incidents to avoid

### Key Features

#### Incident Avoidance System

The service dynamically adjusts routes based on reported incidents:

```csharp
private object AreasToAvoid(List<IncidentDto> incidents)
{
    var areasToAvoid = new
    {
        avoidAreas = new
        {
            rectangles = incidents.Select(incident =>
            {
                double size = GetAvoidanceAreaSize(incident.Type);
                return new
                {
                    southWestCorner = new { latitude = incident.Latitude - size, longitude = incident.Longitude - size },
                    northEastCorner = new { latitude = incident.Latitude + size, longitude = incident.Longitude + size }
                };
            }).ToList()
        }
    };

    return areasToAvoid;
}
```

This creates rectangular areas around incidents that the routing algorithm will try to avoid. The size of these areas varies by incident type (accidents create larger avoidance zones than police controls, for example).

## Data Persistence

The service uses MySQL with Entity Framework Core to store users' saved itineraries. The schema includes:

### `UserItinerary` Table

- `Id` (GUID, Primary key)
- `UserId` (GUID)

### `Itinerary` Table

- `Id` (GUID, Primary key)
- `Departure` (string)
- `DepartureLon` (double)
- `DepartureLat` (double)
- `Arrival` (string)
- `ArrivalLon` (double)
- `ArrivalLat` (double)
- `TravelMode` (string)
- `Distance` (double)
- `Duration` (double)
- `UserItineraryId` (GUID, Foreign key)

## Configuration

The service requires the following environment variables:

- `TOMTOM_URL`: Base URL for the TomTom API
- `TOMTOM_APIKEY`: API key for TomTom services
- `GEOAPIFY_URL`: Base URL for the Geoapify API
- `GEOAPIFY_APIKEY`: API key for Geoapify services
- `NAV_DB`: Name of the MySQL database
- `NAV_DB_USER`: Username for database access
- `NAV_DB_PSW`: Password for database access

## Development

To run the service locally:

```bash
cd navigation-service
dotnet run
```

## Docker

The service can be containerized using the provided Dockerfile:

```bash
docker build -f Dockerfile.dev -t navigation-service .
```

## API Documentation

**Swagger API URL:** [http://navigation.localhost/swagger/index.html](http://navigation.localhost/swagger/index.html)
