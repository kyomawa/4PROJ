# Mobile App

## Overview

The Mobile App Service is the React Native mobile client for the application, a Waze-like navigation system. It provides:

- Interactive map-based navigation interface
- Real-time traffic incident reporting and viewing
- User authentication and profile management
- Turn-by-turn navigation with voice guidance
- Route planning with incident avoidance

This client application communicates with various backend microservices to provide a seamless navigation experience.

## Technologies

- React Native with Expo
- TypeScript
- NativeWind (Tailwind CSS for React Native)
- React Navigation & Expo Router
- Expo Location & React Native Maps
- Expo Speech (for voice guidance)
- Axios for API requests
- Zod for validation
- React Hook Form
- AsyncStorage for local data persistence
- SignalR for real-time notifications

## Features

### Authentication

- User registration and login
- Social login (Google, Facebook)
- Profile management and settings
- Secure token storage

### Map and Navigation

- Interactive map display with current location
- Incident markers on the map
- Route calculation and display with multiple options
- Turn-by-turn navigation instructions
- Voice guidance for directions
- Route recalculation based on new incidents or off-route conditions

### Incident Management

- Report new incidents (accidents, bottlenecks, road closures, etc.)
- View incidents on the map
- Like/dislike incidents for verification
- Detailed incident information view

### Location Search

- Address search and geocoding
- Recent search history
- Current location selection
- Destination selection for navigation

### User Preferences

- Transport mode selection (car, bike, foot, public transport)
- Route optimization settings
- Saved itineraries management

### Admin Dashboard

- User registration statistics
- Incident type distribution
- Congestion pattern analysis

## Setup and Running Instructions

### Prerequisites

- Node.js (preferably the version specified in the Dockerfile)
- Docker and Docker Compose
- Expo CLI (optional for local development)

### Environment Variables

The mobile app requires the following environment variables:

- `EXPO_PUBLIC_API_BASE_URL`: Base URL for the backend API (set in the `.env` file)

### Running with Docker Compose

The Supmap application is designed to run as a microservices architecture. The mobile app service is part of this architecture and should be launched using Docker Compose:

1. Clone the repository containing all microservices
2. Copy `.env.example` to `.env` and configure the required variables:

   ```
   EXPO_PUBLIC_API_BASE_URL=http://your_host_machine_ip  # Use your local machine IP, not localhost
   ```

3. Run the Docker Compose command from the project root:
   ```bash
   docker compose watch
   ```
   This will start all services including the mobile app service with live reload capabilities.

### Accessing the Mobile App

Once the Docker Compose setup is running:

1. The Expo development server will start on port 19000
2. You can access the mobile app using one of these methods:

   a. **Expo Go App** (recommended for testing on physical devices):

   - Install the Expo Go app on your mobile device
   - Find the QR code in the terminal output of the mobile-app-service
   - Scan the QR code with your device camera or the Expo Go app
   - The app will load on your device

   b. **Development Mode in Browser**:

   - Access the Expo DevTools at `http://localhost:19001`
   - You can run the app in a web browser for basic testing
   - Note that some native features might not work properly in browser mode

   c. **iOS Simulator or Android Emulator**:

   - If you have Xcode or Android Studio with emulators set up
   - In the Expo DevTools interface, click on "Run on iOS simulator" or "Run on Android device/emulator"

### Standalone Development

If you prefer to run the mobile app service independently:

```bash
cd mobile-app-service
npm install
npm run dev
```

## Architecture

### App Structure

The application follows the Expo Router file-based routing approach:

- **`app/_layout.tsx`**: Main application layout and provider setup
- **`app/index.tsx`**: Authentication screen (login/registration)
- **`app/(root)/_layout.tsx`**: Tab navigation layout for authenticated users
- **`app/(root)/home/index.tsx`**: Main map screen
- **`app/(root)/search/index.tsx`**: Location search screen
- **`app/(root)/route/index.tsx`**: Route planning screen
- **`app/(root)/navigation/index.tsx`**: Active navigation screen
- **`app/(root)/profile/index.tsx`**: User profile management
- **`app/(root)/incident/report.tsx`**: Incident reporting screen

### Contexts

The app implements several React Contexts for state management:

- **AuthContext**: Manages authentication state and user data
- **IncidentContext**: Manages incident data fetching and reporting
- **NavigationContext**: Manages active navigation state
- **PreferencesContext**: Manages user preferences like transport mode

### API Integration

The mobile app communicates with the following backend services:

- **Auth Service**: For user authentication
- **User Service**: For user profile management
- **Navigation Service**: For route calculation and location search
- **Incident Service**: For incident reporting and retrieval
- **Alert Service**: For real-time notifications using SignalR
- **Statistics Service**: For admin dashboard data

## Building for Production

To create a production build:

```bash
cd mobile-app-service
npm install
npx expo build:android  # For Android
npx expo build:ios      # For iOS (requires Apple Developer account)
```

## Troubleshooting

### Common Issues

1. **QR Code Scanning Issues**:

   - Ensure your mobile device and development machine are on the same network
   - Try using the Expo Go app's "Enter URL manually" option and enter `exp://YOUR_IP:19000`

2. **API Connection Issues**:

   - Verify the `EXPO_PUBLIC_API_BASE_URL` is set to your machine's actual IP address
   - Check that the backend services are running properly
   - Ensure network firewall settings allow connections on the required ports

3. **Build Errors**:
   - Clear the npm cache: `npm cache clean --force`
   - Delete the node_modules folder and run `npm install` again
   - Try resetting the Expo cache: `npx expo start -c`

### Logs

Docker logs can be helpful for troubleshooting:

```bash
docker logs -f Supmap-mobile-app-service-1
```

## Contributing

When contributing to this mobile app service:

1. Follow the existing code structure and naming conventions
2. Use the provided component library for UI elements
3. Ensure new features work on both iOS and Android
4. Test thoroughly before submitting pull requests
