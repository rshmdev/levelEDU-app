import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Easing } from "react-native";

const AnimatedLogo = () => {
  // Animações mais sutis
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de "respiração" - escala sutil
    const breathingLoop = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Animação de flutuação suave
    const floatLoop = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -8,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Iniciar animações
    breathingLoop();
    floatLoop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: floatAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Animated.Image
        source={require("@/assets/images/leveledu-logo.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: 400,
    height: 400,
    zIndex: 2,
  },
});

export default AnimatedLogo;
