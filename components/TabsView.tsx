import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Fragment, ReactNode, useCallback, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

const image = require("@/assets/images/bg.jpg");

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
  </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
