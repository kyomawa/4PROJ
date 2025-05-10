# Statistics Service

## Overview

The Statistics Service is responsible for collecting, analyzing, and presenting statistical data from the Supmap application. This service:

- Collects and analyzes user registration data
- Tracks traffic incident trends
- Identifies congestion patterns and peak times
- Provides visualizations and analytics to administrators

The service aggregates data from the User and Incident services to generate meaningful insights about application usage and traffic conditions.

## Technologies

- .NET 8.0
- ASP.NET Web API
- Entity Framework Core
- Multiple database connections (user and incident)
- JWT Authentication

## API Endpoints

### Statistics Controller

#### `GET /statistic/user`

Retrieves user registration statistics by month for the current year.

**Authentication:** Required (Admin role)

**Responses:**

- `200 OK`: Returns a list of `UserCountByMonthString` objects with registration data by month
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://statistics.localhost/statistic/user \
  -H "Authorization: Bearer {token}"
```

**Response Schema:**

```json
[
  {
    "month": "January",
    "count": 42
  },
  {
    "month": "February",
    "count": 58
  },
  ...
]
```

#### `GET /statistic/incidents`

Retrieves the count of incidents by type.

**Authentication:** Required (Admin role)

**Responses:**

- `200 OK`: Returns a list of `IncidentsCountByType` objects with the number of incidents by type
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://statistics.localhost/statistic/incidents \
  -H "Authorization: Bearer {token}"
```

**Response Schema:**

```json
[
  {
    "type": "Crash",
    "count": 15
  },
  {
    "type": "Bottling",
    "count": 78
  },
  ...
]
```

#### `GET /statistic/congestion`

Retrieves the distribution of congestion incidents by hour of the day.

**Authentication:** Required (Admin role)

**Responses:**

- `200 OK`: Returns a list of `IncidentsCountByHour` objects with the number of incidents by hour
- `500 Internal Server Error`: Server error with error message

**Usage Example:**

```bash
curl -X GET http://statistics.localhost/statistic/congestion \
  -H "Authorization: Bearer {token}"
```

**Response Schema:**

```json
[
  {
    "hour": 0,
    "count": 3
  },
  {
    "hour": 1,
    "count": 1
  },
  ...
  {
    "hour": 8,
    "count": 45
  },
  ...
  {
    "hour": 18,
    "count": 67
  },
  ...
]
```

### Health Controller

#### `GET /health`

Checks the health status of the service.

**Responses:**

- `200 OK`: Returns a simple status message indicating the service is healthy

**Usage Example:**

```bash
curl -X GET http://statistics.localhost/health
```

**Response:**

```json
{
  "status": "healthy"
}
```

## Data Models

### UserCountByMonthString

```csharp
public class UserCountByMonthString
{
    public string Month { get; set; }
    public int Count { get; set; }
}
```

### IncidentsCountByType

```csharp
public class IncidentsCountByType
{
    public IncidentType Type { get; set; }
    public int Count { get; set; }
}
```

### IncidentsCountByHour

```csharp
public class IncidentsCountByHour
{
    public int Hour { get; set; }
    public int Count { get; set; }
}
```

## Architecture

### Database Contexts

The service uses two separate database contexts:

- **UserContext**: Connects to the user database to collect registration statistics
- **IncidentContext**: Connects to the incident database to collect incident and congestion statistics

### Repositories

- **IUserRepository**: Interface for statistical operations on user data
- **InterfaceIncidentRepository**: Interface for statistical operations on incident data

### Services

- **IStatisticService**: Main interface defining all statistical analysis functions
- **StatisticService**: Implementation that combines and analyzes data from both databases

## Key Implementation Details

### User Statistics by Month

```csharp
public async Task<List<UserCountByMonthString>> UsersCountByMonth()
{
    var usersCountByMonths = await userRepository.UsersCountByMonthThisYear();

    var countsAsStringMonths = Months.Select((monthName, index) =>
    {
        var monthNumber = index + 1;
        var count = usersCountByMonths.FirstOrDefault(x => x.Month == monthNumber)?.Count ?? 0;

        return new UserCountByMonthString
        {
            Month = monthName,
            Count = count
        };
    }).ToList();

    return countsAsStringMonths;
}
```

### Congestion Periods

```csharp
public async Task<List<IncidentsCountByHour>> GetCongestionsPeriod()
{
    var incidentsCountByHour = await incidentRepository.GetIncidentsCountsByHour();

    var countsAsStringTypes = Enumerable.Range(0, HoursInDay).Select(hour =>
    {
        var count = incidentsCountByHour.FirstOrDefault(x => x.Hour == hour)?.Count ?? 0;

        return new IncidentsCountByHour
        {
            Hour = hour,
            Count = count
        };
    }).ToList();

    return countsAsStringTypes;
}
```

## Configuration

The service requires the following environment variables:

- `USER_DB`: Name of the user database
- `USER_DB_USER`: Username for user database access
- `USER_DB_PSW`: Password for user database access
- `INCIDENT_DB`: Name of the incident database
- `INCIDENT_DB_USER`: Username for incident database access
- `INCIDENT_DB_PSW`: Password for incident database access

## Development

To run the service locally:

```bash
cd statistic-service
dotnet run
```

## Docker

The service can be containerized using the provided Dockerfile:

```bash
docker build -f Dockerfile.dev -t statistic-service .
```

## API Documentation

**Swagger API URL:** [http://statistics.localhost/swagger/index.html](http://statistics.localhost/swagger/index.html)
