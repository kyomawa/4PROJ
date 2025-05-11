# Supmap Web Service

## Overview

The Supmap Web Service is the frontend component of the Supmap application, a real-time navigation system similar to Waze. It provides an interactive web interface for users to:

- View real-time maps with traffic data and incidents
- Search for and calculate optimal routes between locations
- Report traffic incidents and obstacles
- Validate or refute incidents reported by other users
- Save and manage favorite routes
- View detailed statistics (for administrators)

This service is part of a microservices ecosystem that includes multiple backend services for authentication, user management, navigation, incident tracking, alerting, and statistics.

## Technologies

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: TailwindCSS, Shadcn UI components
- **State Management**: React hooks and Server Actions
- **Mapping**: Leaflet
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Authentication**: JWT-based auth via Auth Service
- **API Communication**: Server-side fetch with Next.js Server Actions

## Features

### Public User Features

- **Interactive Map**: Real-time navigation map with incident markers
- **Route Planning**: Calculate routes with various parameters (mode of transport, route type, toll avoidance)
- **Incident Reporting**: Report accidents, traffic jams, road closures, and other obstacles
- **Community Validation**: Like or dislike incidents to confirm or refute their validity
- **Route Optimization**: Automatically recalculate routes based on traffic conditions
- **Itinerary Management**: Save, retrieve, and reuse favorite routes
- **User Profile**: Manage personal information and preferences

### Administrative Features

- **Incident Management**: View and manage all reported incidents
- **Statistics Dashboard**: Visualize user registrations, incident types, and congestion patterns
- **User Analytics**: Monitor platform usage and growth

## Prerequisites

- Node.js 20.x or newer
- Docker and Docker Compose (for running the full application stack)
- Git

## Installation and Setup

### Local Development Setup

1. Clone the repository:

   ```bash
   git clone https://your-repository-url.git
   cd supmap
   ```

2. Install website-service dependencies:

   ```bash
   cd website-service
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Configure the `.env` file with appropriate values.

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Using Docker Compose (Development)

To run the complete application with all services:

```bash
# From the project root directory
docker compose watch
```

This will start all services including the website-service with live reload capabilities. The application will be available at [http://localhost](http://localhost).

## Docker

### Development

The development Docker setup uses:

- Node.js 23-alpine image
- Hot-reloading for development
- Volume mounts for source files

```bash
# Build and run development container
docker build -f Dockerfile.dev -t supmap-website-dev .
docker run -p 3000:3000 -v $(pwd):/app supmap-website-dev
```

### Production

For production deployment, use the Docker Compose production configuration:

```bash
# From the project root directory
docker-compose -f docker-compose.prod.yml up -d
```

## Project Structure

```
website-service/
├── src/
│   ├── actions/            # Server Actions for API communication
│   │   ├── auth/           # Authentication actions
│   │   ├── incident/       # Incident reporting and management
│   │   ├── navigation/     # Route calculation and management
│   │   ├── statistics/     # Statistics and analytics
│   │   └── user/           # User profile management
│   ├── app/                # Next.js application routes
│   │   ├── (Website)/      # Public website routes
│   │   │   ├── (auth)/     # Authentication pages (login/signup)
│   │   │   ├── (site)/     # Main site pages (map, profile, etc.)
│   │   │   └── layout.tsx  # Website layout
│   │   ├── (WebApp)/       # Admin panel routes
│   │   │   └── panel/      # Admin dashboard and tools
│   ├── components/         # Reusable React components
│   │   ├── ui/             # UI components (buttons, forms, etc.)
│   │   └── FormFields/     # Form input components
│   ├── constants/          # Application constants
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
└── public/                 # Static assets
    └── icons/              # Map and UI icons
```

## Configuration

The application requires the following environment variables:

```
# API Base URLs
API_BASE_URL=http://traefik  # Internal service communication

# External API Keys (if applicable)
# No external API keys are required for basic functionality

# Development Settings
HOST_PORT_TRAEFIK=80         # Port for Traefik
HOST_PORT_TRAEFIK_DASHBOARD=8080  # Port for Traefik dashboard
```

## Available Scripts

```bash
# Development
npm run dev         # Start development server

# Build
npm run build       # Build for production

# Production
npm start           # Start production server

# Linting
npm run lint        # Run ESLint
```

## Integration with Backend Services

The web service communicates with several backend microservices:

- **Auth Service**: User authentication and JWT token management
- **User Service**: User profile management
- **Navigation Service**: Route calculation and optimization
- **Incident Service**: Traffic incident reporting and retrieval
- **Alert Service**: Real-time notifications for traffic conditions
- **Statistics Service**: Data analytics for the admin dashboard

All service URLs are configured in `src/constants/api.ts`.
