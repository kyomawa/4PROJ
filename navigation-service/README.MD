# Navigation Service

## Overview

The Navigation Service is a core component of the Laynz application, responsible for handling navigation-related functionality including:

- Route calculation between points with real-time traffic consideration
- Location geocoding (converting text addresses to geographic coordinates)
- Providing itinerary details with step-by-step directions
- Avoiding areas with reported incidents
- Managing different travel modes and route types

## Technologies

- .NET 8.0
- ASP.NET Web API
- AutoMapper
- External API integrations (TomTom API, Geoapify API)

## API Endpoints

### Location Controller

#### `GET /location`

Converts text locations to geographic coordinates.

**Query Parameters:**

- `textLocation` (string, required): The address or location text to geocode

**Response:**

- `200 OK`: Returns a list of `LocationDto` objects matching the query
- `404 Not Found`: No data found for the location
- `500 Internal Server Error`: Server error with error message

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

Calculates an itinerary between two points.

**Query Parameters:**

- `departureLat` (double, required): Departure latitude
- `departureLon` (double, required): Departure longitude
- `arrivalLat` (double, required): Arrival latitude
- `arrivalLon` (double, required): Arrival longitude
- `travelMethod` (string, required): Transport method ('car', 'bike', 'foot', or 'train')
- `routeType` (string, required): Type of route ('fastest', 'shortest', 'eco', or 'thrilling')

**Response:**

- `200 OK`: Returns an `ItineraryDto` object with the calculated route
- `400 Bad Request`: Invalid parameters or points
- `500 Internal Server Error`: Server error with error message

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
      "like": 0,
      "dislike": 0,
      "creationDate": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Health Controller

#### `GET /health`

Checks the health of the service.

**Response:**

- `200 OK`: Returns a simple status message

## Architecture

### Services

- **LocationService**: Converts text locations to geographic coordinates using Geoapify API
- **ItineraryService**: Calculates routes between points using TomTom API and handles incident avoidance

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

## Configuration

The service requires the following environment variables:

- `TOMTOM_URL`: Base URL for the TomTom API
- `TOMTOM_APIKEY`: API key for TomTom services
- `GEOAPIFY_URL`: Base URL for the Geoapify API
- `GEOAPIFY_APIKEY`: API key for Geoapify services

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

Swagger UI is available at `/swagger` when the service is running.

**URL** : [http://navigation.localhost/swagger/index.html](http://navigation.localhost/swagger/index.html)
