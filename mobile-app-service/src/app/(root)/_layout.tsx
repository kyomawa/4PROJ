import { Tabs } from "expo-router";
import { Platform } from "react-native";
import Icon from "../../components/Icon";

export default function RootLayout() {
  return (
    <Tabs
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
          title: "Map",
          tabBarIcon: ({ color, size }) => <Icon name="Map" className={`text-[${color}] size-${size}`} />,
        }}
      />

      <Tabs.Screen
        name="incident/index"
        options={{
          title: "Incidents",
          tabBarIcon: ({ color, size }) => <Icon name="TriangleAlert" className={`text-[${color}] size-${size}`} />,
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
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
    </Tabs>
  );
}
