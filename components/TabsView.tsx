import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Fragment, ReactNode, useCallback, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";

const image = require("@/assets/images/bg.jpg");

export const toastConfig: ToastConfig = {
  // Estilo padrão
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#2ecc71",
        backgroundColor: "#1c1c1c",
        zIndex: 9999, // Força o zIndex
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      }}
      text2Style={{
        color: "#ccc",
        fontSize: 14,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#e74c3c",
        backgroundColor: "#1c1c1c",
        zIndex: 9999, // Força o zIndex
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      }}
      text2Style={{
        color: "#ccc",
        fontSize: 14,
      }}
    />
  ),
};

export const TabsView = ({ children }: { children: ReactNode }) => {
  const [key, setKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setKey((prevKey) => prevKey + 1);
    }, [])
  );

  return (
    <Fragment>
    <Animated.View key={key} style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />
        <StatusBar />
        {children}
      </ImageBackground>
    </Animated.View>
    <Toast config={toastConfig} topOffset={50} />
  </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Preto com opacidade de 30%
  },
});
