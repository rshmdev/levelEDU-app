import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { Entypo } from "@expo/vector-icons";
import { AppStateStatus, Platform, View, StatusBar } from "react-native";
import { useOnlineManager } from "@/hooks/useOnlineManager";
import { useAppState } from "@/hooks/useAppState";
import SplashScreenComponent from "@/components/SplashScreen";
import * as Updates from "expo-updates";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [loaded, setLoaded] = useState(false);
  useOnlineManager();

  useAppState(onAppStateChange);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await Font.loadAsync(Entypo.font);
        setLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar fontes ou assets:", error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // Reinicia o app para aplicar a atualização
        }
      } catch (error) {
        console.log("Erro ao buscar atualizações:", error);
      }
    }

    checkForUpdates();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  });

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {loading ? (
            <SplashScreenComponent />
          ) : (
            <SafeArea />
          )}
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function SafeArea() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      backgroundColor: "#000", // ou a cor de fundo da sua app

    }}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor="#000"

      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 500,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </View>
  );
}
