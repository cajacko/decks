import { Tabs } from "expo-router";

export default function DeckLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "none",
          tabBarLabel: "Edit",
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          headerShown: false,
          animation: "none",
          tabBarLabel: "Play",
        }}
      />
    </Tabs>
  );
}
