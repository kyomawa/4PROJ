import { Tabs } from "expo-router";
import { Platform } from "react-native";
import Icon from "../../components/Icon";

// ========================================================================================================

export default function RootLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 85 : 60,
          paddingTop: 5,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          borderTopWidth: 1,
          borderTopColor: "#eee",
        },
        tabBarActiveTintColor: "#695BF9",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontFamily: "Satoshi-Medium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Carte",
          tabBarIcon: ({ color, size }) => <Icon name="Map" className={`text-[${color}] size-${size}`} />,
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Icon name="User" className={`text-[${color}] size-${size}`} />,
        }}
      />

      {/* Invisible screens */}
      <Tabs.Screen
        name="incident/report"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="search/index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="route/index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="navigation/index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile/edit"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile/account-settings"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile/saved-itineraries"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="admin/statistics"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

// ========================================================================================================
