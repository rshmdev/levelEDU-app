import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";

const GameButton = ({ icon, label }: any) => {
  return (
    <LinearGradient
      colors={[Colors.darkGray, Colors.gradientStart]} // Gradiente para o efeito de brilho
      style={styles.button}
    >
      <View style={styles.innerShadow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  innerShadow: {
    width: "90%",
    height: "90%",
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Simula um brilho interno
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
    color: "#fff",
  },
  label: {
    fontSize: 10,
    color: "#fff",
    marginTop: 5,
  },
});

export default GameButton;
