# Supmap - Web Navigation Application

## Overview

Supmap is a real-time web navigation application similar to Waze, allowing users to receive information about traffic, accidents, and obstacles. The application also enables users to report incidents and receive optimized routes based on current traffic conditions.

This application is part of a microservice ecosystem for the Supmap project, including:

- A web application (this repository)
- A mobile application
- Backend APIs (navigation, incidents, users, authentication)

## Main Features

- 🗺️ **Real-time Navigation**: Calculation of optimized routes based on traffic
- 🚧 **Incident Reporting**: Users can report accidents, traffic jams, road closures, etc.
- 👍 **Community Validation**: Users can confirm or deny reported incidents
- 🔄 **Automatic Route Recalculation**: In case of traffic jams or incidents
- 💰 **Route Personalization**: Options to avoid tolls, highways, etc.

## Technologies

- **Frontend**: Next.js 15 (React 19), TypeScript
- **Styling**: TailwindCSS, Shadcn UI
- **Mapping**: Google Maps API
- **Authentication**: JWT via authentication service
- **API**: Communication with REST microservices

## Prerequisites

- Node.js 20+
- Docker and Docker Compose (for complete environment)
- Google Maps API key with Maps JavaScript API enabled

## Installation

1. Clone this repository:

```bash
git clone https://github.com/your-username/Supmap-web.git
cd Supmap-web
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

4. Configure your Google Maps API key and other variables in `.env.local`

5. Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Installation with Docker

To run the complete application with all services, use Docker Compose:

```bash
# In the root of the main project (where docker-compose.yml is located)
docker compose up --build
```

## Project Structure

```
src/
├── actions/             # Server actions for APIs
├── app/                 # Next.js application structure
│   ├── (Website)        # General site layout
│   │   ├── (auth)       # Authentication pages (login, signup)
│   │   ├── (site)       # Main site pages (map, profile, etc.)
│   │   └── layout.tsx   # Common layout for all pages
├── components/          # Reusable components
├── constants/           # Constants and static data
├── lib/                 # Libraries and utilities
│   ├── api-client.ts    # API client for backend communication
│   └── cookies.ts       # Utilities for client-side cookie management
├── types/               # TypeScript types
└── globals.css          # Global styles with TailwindCSS
```

## Points to Note

- The application uses Google Maps and requires a valid API key
- Communication with microservices is done through REST APIs defined in `.env.local`
- All backend services must be running for full functionality

## Development and Testing

```bash
# Development
npm run dev

# Build for production
npm run build

# Start in production mode
npm run start

# Linting
npm run lint
```

## Contributing

Check the contributing guide in [CONTRIBUTING.md](../CONTRIBUTING.md) at the root of the project.

## License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for more details.
