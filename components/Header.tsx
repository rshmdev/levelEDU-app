import type React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { useAuth } from "@/hooks/useAuth";



const Header: React.FC = () => {

  const {user} = useAuth()

  return (
    <View style={styles.header}>
      <LinearGradient
        colors={["#FFD700", "#FFAA00"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.coinsContainer}
      >
        <LottieView
          source={require("@/assets/coin.json")}
          autoPlay
          loop
          style={{
            width: 50,
            height: 50,
            left: -15,
            top: -10,
            position: "absolute",
            zIndex: 2,
          }}
        />
        <Text style={styles.coinsText}>{user?.coins}</Text>
      </LinearGradient>

      <LinearGradient
        colors={["#4A90E2", "#007AFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.xpContainer}
      >
        <Text style={styles.xpText}>{user?.xp}</Text>
        <FontAwesome5 name="star" size={20} color="#FFF" />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  coinsContainer: {
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: "#FFD700",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  coinsText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ae759f",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: "#ae759f",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  progressText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: "#007AFF",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  xpText: {
    marginRight: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default Header;
