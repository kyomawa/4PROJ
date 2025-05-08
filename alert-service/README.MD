# Alert Service

## Overview

The Alert Service is responsible for real-time traffic alert distribution to Supmap application users. This service uses SignalR to establish persistent connections with clients and send them immediate notifications about incidents near their route or current position.

## Technologies

- .NET 8.0
- ASP.NET Core SignalR
- HTTP Client for communication with the Incident Service

## SignalR Hub

The Alert Service uses a SignalR hub for real-time bidirectional communication with clients.

**Hub URL:** `/hub`

### Hub Methods

#### `GetNearIncidents`

Checks for incidents near a specific geographic position.

**Parameters:**

```json
{
  "longitude": 0.0,
  "latitude": 0.0
}
```

**Response:**
Sends an `IncidentsNear` event to the calling client with details of nearby incidents.

**Usage Example:**

```javascript
// Client-side (JavaScript)
const connection = new signalR.HubConnectionBuilder().withUrl("http://alert.localhost/hub").build();

// Start connection
await connection.start();

// Listen for nearby incidents
connection.on("IncidentsNear", (incidents) => {
  console.log("Nearby incidents:", incidents);
});

// Request nearby incidents
await connection.invoke("GetNearIncidents", {
  longitude: 2.3522,
  latitude: 48.8566,
});
```

#### `GetItineraryIncidents`

Checks for incidents on a route within a specific geographic area.

**Parameters:**

```json
{
  "minLat": 0.0,
  "maxLat": 0.0,
  "minLon": 0.0,
  "maxLon": 0.0
}
```

**Response:**
Sends an `ItineraryIncidents` event to the calling client with details of incidents on the route.

**Usage Example:**

```javascript
// Client-side (JavaScript)
const connection = new signalR.HubConnectionBuilder().withUrl("http://alert.localhost/hub").build();

// Start connection
await connection.start();

// Listen for itinerary incidents
connection.on("ItineraryIncidents", (incidents) => {
  console.log("Itinerary incidents:", incidents);
});

// Request incidents on an itinerary
await connection.invoke("GetItineraryIncidents", {
  minLat: 48.8,
  maxLat: 49.0,
  minLon: 2.3,
  maxLon: 2.4,
});
```

## Rate Limiting Protection

The service implements a rate limiting filter (`RateLimitHubFilter`) that restricts calls to once every 10 seconds per connection, to protect the service from excessive calls.

## Deployment

The service can be containerized using the provided Dockerfile:

```bash
docker build -f Dockerfile.dev -t alert-service .
```

## API Documentation

**Swagger API URL:** [http://alert.localhost/swagger/index.html](http://alert.localhost/swagger/index.html)
