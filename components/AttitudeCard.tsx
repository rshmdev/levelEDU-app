import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

interface AnimatedCardProps {
  title: string;
  description: string;
  createdAt: string;
  isPositive: boolean;
  isClaimed: boolean;
  coins: number;
  xp: number;
}

const AttitudeCard: React.FC<AnimatedCardProps> = ({
  title,
  description,
  createdAt,
  isPositive,
  isClaimed,
  coins,
  xp,
}) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;
  const glowValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isClaimed) {
      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Shimmer animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 2500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isClaimed]);

  const shimmerTranslate = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 400],
  });

  const glowOpacity = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.8],
  });

  return (
    <Animated.View style={[styles.card, { opacity: !isClaimed ? 1 : 0.9 }]}>
      {isClaimed && (
        <Animated.View
          style={[
            styles.glowContainer,
            {
              opacity: glowOpacity,
            },
          ]}
        />
      )}
      <LinearGradient
        colors={isPositive ? ["#4CAF50", "#45a049"] : ["#ff3b30", "#dc3545"]}
        style={styles.cardBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {!isClaimed && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [
                  { translateX: shimmerTranslate },
                  { rotate: "-60deg" },
                ],
              },
            ]}
          />
        )}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome5
                name={isPositive ? "smile" : "frown"}
                size={16}
                color="#fff"
              />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          <Text style={styles.dateText}>{createdAt}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.impactContainer}>
          {coins !== undefined && (
            <View style={styles.impactItem}>
              <FontAwesome5
                name="coins"
                size={14}
                color={isPositive ? "#FFD700" : "#fff"}
              />
              <Text style={styles.impactText}>
                {coins > 0 ? "+" : ""}
                {coins}
              </Text>
            </View>
          )}
          {xp > 0 && (
            <View style={styles.impactItem}>
              <FontAwesome5 name="star" size={14} color="#fff" />
              <Text style={styles.impactText}>+{xp} XP</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  glowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  cardBackground: {
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    transform: [{ skewX: "-20deg" }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  dateText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 16,
  },
  impactContainer: {
    flexDirection: "row",
    gap: 12,
  },
  impactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  impactText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AttitudeCard;
