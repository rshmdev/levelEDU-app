"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { FontAwesome5 } from "@expo/vector-icons"

interface AnimatedCardProps {
  title: string
  description: string
  createdAt: string
  isPositive: boolean
  isClaimed: boolean
  coins: number
  xp: number
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
  const shimmerValue = useRef(new Animated.Value(0)).current
  const glowValue = useRef(new Animated.Value(0)).current

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
        ]),
      ).start()

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
        ]),
      ).start()
    }
  }, [isClaimed])

  const shimmerTranslate = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 400],
  })

  const glowOpacity = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.8],
  })

  return (
    <Animated.View style={[styles.card, { opacity: !isClaimed ? 1 : 0.9 }]}>
      {!isClaimed && (
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
        colors={isPositive ? [Colors.success[400], Colors.success[500]] : [Colors.error[400], Colors.error[500]]}
        style={styles.cardBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {!isClaimed && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: shimmerTranslate }, { rotate: "-60deg" }],
              },
            ]}
          />
        )}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name={isPositive ? "smile" : "frown"} size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.dateText}>{createdAt}</Text>
            </View>
          </View>
          {!isClaimed && (
            <View style={styles.unclaimedBadge}>
              <FontAwesome5 name="gift" size={12} color="#FFD700" />
              <Text style={styles.unclaimedText}>Novo</Text>
            </View>
          )}
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.rewardsContainer}>
          {coins !== 0 && (
            <View style={styles.rewardItem}>
              <View
                style={[
                  styles.rewardIconContainer,
                  { backgroundColor: isPositive ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 59, 48, 0.2)" },
                ]}
              >
                <FontAwesome5 name="coins" size={14} color={isPositive ? "#FFD700" : "#fff"} />
              </View>
              <Text style={styles.rewardText}>
                {coins > 0 ? "+" : ""}
                {coins} moedas
              </Text>
            </View>
          )}
          {xp !== 0 && (
            <View style={styles.rewardItem}>
              <View style={[styles.rewardIconContainer, { backgroundColor: "rgba(255, 255, 255, 0.2)" }]}>
                <FontAwesome5 name="star" size={14} color="#fff" />
              </View>
              <Text style={styles.rewardText}>
                {xp > 0 ? "+" : ""}
                {xp} XP
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  glowContainer: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    backgroundColor: "rgba(255, 215, 0, 0.4)",
    zIndex: -1,
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
    width: 100,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
  },
  unclaimedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  unclaimedText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFD700",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 16,
    lineHeight: 20,
  },
  rewardsContainer: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  rewardIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
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
})

export default AttitudeCard
