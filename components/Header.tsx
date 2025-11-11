import type React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/Colors";

const Header: React.FC = () => {
  const { user } = useAuth()

  return (
    <View style={styles.header}>
      <LinearGradient
        colors={[Colors.warning[400], Colors.warning[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.coinsContainer}
      >
        <FontAwesome5 name="coins" size={16} color={Colors.white} />
        <Text style={styles.coinsText}>{user?.coins || 0}</Text>
      </LinearGradient>

      <LinearGradient
        colors={[Colors.secondary[500], Colors.secondary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.xpContainer}
      >
        <Text style={styles.xpText}>{user?.xp || 0}</Text>
        <FontAwesome5 name="star" size={16} color={Colors.white} />
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
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: Colors.warning[400],
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  coinsText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: Colors.secondary[500],
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  xpText: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
});

export default Header;
