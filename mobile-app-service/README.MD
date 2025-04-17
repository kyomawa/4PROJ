# Mobile App Service

## Overview

The Mobile App Service is the React Native mobile client for the Laynz application. It provides:

- Interactive map-based navigation interface
- Real-time traffic incident reporting and viewing
- User authentication and profile management
- Turn-by-turn navigation with voice guidance
- Route planning with incident avoidance

This client application communicates with various backend microservices to provide a seamless navigation experience similar to Waze.

## Technologies

- React Native (Expo)
- TypeScript
- NativeWind (Tailwind CSS for React Native)
- React Navigation
- Expo Router
- Expo Location
- React Native Maps
- Expo Speech (for voice guidance)
- Axios for API requests
- Zod for validation
- React Hook Form
- AsyncStorage for local data persistence

## Features

### Authentication

- User registration and login
- Social login (Google, Facebook)
- Profile management
- Secure token storage

### Map and Navigation

- Interactive map display with current location
- Incident markers on the map
- Route calculation and display
- Turn-by-turn navigation instructions
- Voice guidance for directions
- Route recalculation based on new incidents or off-route conditions

### Incident Management

- Report new incidents (accidents, bottlenecks, etc.)
- View incidents on the map
- Like/dislike incidents for verification
- Detailed incident information view

### Location Search

- Address search and geocoding
- Recent search history
- Current location selection
- Destination selection for navigation

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

### Key Feature Implementations

#### Turn-by-Turn Navigation

The app includes a sophisticated turn-by-turn navigation system that provides voice guidance and automatically recalculates routes:

```typescript
// Speech guidance system
const speakInstruction = (instruction: string) => {
  Speech.speak(instruction, {
    language: "fr-FR",
    rate: 0.8,
    pitch: 1.0,
  });
};

// Route progress tracking
useEffect(() => {
  if (!location || !itinerary || !currentStep || isRecalculating) return;

  const checkProgressAlongRoute = async () => {
    // Check if destination reached
    if (currentStepIndex === itinerary.steps.length - 1) {
      const distanceToDestination = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude
      );

      if (distanceToDestination < 0.05) {
        Alert.alert("Destination atteinte", "Vous êtes arrivé à destination");
        clearNavigation();
        setItinerary(null);
        router.replace("/home");
      }
      return;
    }

    // Check for next instruction
    if (nextStep) {
      const distanceToNextStep = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        nextStep.wayPoints.latitude,
        nextStep.wayPoints.longitude
      );

      if (distanceToNextStep < 0.03 && !recentlyPassedStep) {
        setCurrentStepIndex(currentStepIndex + 1);
        speakInstruction(nextStep.instruction);
        setRecentlyPassedStep(true);
        setTimeout(() => setRecentlyPassedStep(false), 10000);
      }
    }

    // Check if off-route and need recalculation
    const closestPointOnRoute = findClosestPointOnRoute(
      location.coords.latitude,
      location.coords.longitude,
      itinerary.coordinates
    );

    if (closestPointOnRoute.distance > 0.1 && !isRecalculating && !recalculationFailed) {
      speakInstruction("Recalcul de l'itinéraire");
      await fetchRoute(location);
    }
  };

  checkProgressAlongRoute();
}, [location, itinerary, currentStep, currentStepIndex]);
```

#### Incident Reporting System

The app allows users to report and verify incidents:

```typescript
// Incident reporting
const handleSubmit = async () => {
  if (!selectedIncident || !location) {
    Alert.alert(
      "Erreur",
      "Veuillez sélectionner un type d'incident et vous assurer que la localisation est disponible"
    );
    return;
  }

  try {
    setIsSubmitting(true);
    const result = await reportNewIncident({
      type: selectedIncident,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (result) {
      Alert.alert("Merci !", "Incident signalé avec succès");
      router.back();
    } else {
      Alert.alert("Erreur", "Échec du signalement de l'incident. Veuillez réessayer.");
    }
  } catch (error) {
    Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};
```

### API Integration

The mobile app communicates with the following backend services:

- **Auth Service**: For user authentication
- **User Service**: For user profile management
- **Navigation Service**: For route calculation and location search
- **Incident Service**: For incident reporting and retrieval

### Components

Key reusable components include:

- **MapWithIncidents**: Map display with incident markers
- **SearchBar**: Location search interface
- **IncidentButton**: Quick access to incident reporting
- **ActiveNavigationBanner**: Shows active navigation status
- **IncidentDetailsModal**: Displays incident details
- **FormField**: Reusable form input field

## Configuration

The app requires the following environment variables:

- `EXPO_PUBLIC_API_BASE_URL`: Base URL for the backend API

## Development

To run the application in development:

```bash
cd mobile-app-service
npm install
npm run dev
```

### Expo Go

The app can be tested on physical devices using Expo Go:

1. Install the Expo Go app on your device
2. Run the development server: `npm run dev`
3. Scan the QR code with your device

## Building for Production

To create a production build:

```bash
cd mobile-app-service
npm install
npx expo build
```

## Docker

The service can be containerized using the provided Dockerfile:

```bash
docker build -f Dockerfile.dev -t mobile-app-service .
```
