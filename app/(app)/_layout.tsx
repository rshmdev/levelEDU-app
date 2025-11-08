import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 500,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="mission" />
      <Stack.Screen name="ranking" />
    </Stack>
  );
}
