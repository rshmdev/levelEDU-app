import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const Colors = {
  darkPurple: "#210b2c",
  eminence: "#55286f",
  wisteria: "#bc96e6",
  pinkLavender: "#d8b4e2",
  skyMagenta: "#ae759f",
};

interface TabBarIconProps {
  name: string;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, focused }) => {
  const [scaleValue] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconWrapper,
          focused && styles.activeIconWrapper,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        <FontAwesome5
          name={name}
          size={24}
          color={focused ? Colors.wisteria : Colors.skyMagenta}
          style={focused ? styles.activeIcon : styles.icon}
        />
        {focused && <View style={styles.glow} />}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.eminence,
    shadowColor: "#000", // Adiciona profundidade
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Android: Adiciona sombra similar ao iOS
  },
  activeIconWrapper: {
    backgroundColor: Colors.darkPurple,
    borderWidth: 2,
    borderColor: Colors.wisteria,
    shadowColor: Colors.wisteria, // Sombra levemente colorida para o ativo
    shadowOffset: {
      width: -2,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    opacity: 0.7,
  },
  activeIcon: {
    opacity: 1,
  },
  glow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 25,
    backgroundColor: Colors.wisteria,
    opacity: 0.15,
    transform: [{ scale: 1.2 }],
  },
});

export default TabBarIcon;
