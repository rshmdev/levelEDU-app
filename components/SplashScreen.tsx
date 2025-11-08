import React, { useEffect } from "react";
import { View, StyleSheet, Animated, Image } from "react-native";

const SplashScreenComponent = () => {
  const imageScale = new Animated.Value(0.1); // Para o efeito de escala
  const imagePosition = new Animated.Value(-200); // Para o movimento vertical

  useEffect(() => {
    // Executa as animações em paralelo
    Animated.parallel([
      Animated.timing(imageScale, {
        toValue: 1, // Escala de 0.1 para 1
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(imagePosition, {
        toValue: 0, // Movimenta a imagem de -200 para 0
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [imageScale, imagePosition]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("@/assets/images/splash-icon.png")} // Caminho para o ícone
        style={[
          styles.image,
          {
            transform: [
              { scale: imageScale }, // Aplica a escala
              { translateY: imagePosition }, // Aplica o movimento vertical
            ],
          },
        ]}
      />
    </View>
  );
};

export default SplashScreenComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000", // Fundo branco para a splash screen
  },
  image: {
    width: 150, // Largura do ícone
    height: 150, // Altura do ícone
  },
});
