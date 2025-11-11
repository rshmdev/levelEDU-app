"use client"

import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"

interface MissionCardProps {
  title: string
  objective: string
  reward: number
  progress: number
  onPress: () => void
}

const MissionCard: React.FC<MissionCardProps> = ({ title, objective, reward, progress, onPress }) => {
  const shimmerValue = React.useRef(new Animated.Value(0)).current
  const scaleValue = React.useRef(new Animated.Value(1)).current
  const glowValue = React.useRef(new Animated.Value(0)).current
  const isCompleted = progress === 100

  React.useEffect(() => {
    if (isCompleted) {
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
  }, [isCompleted])

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onPress())
  }

  const shimmerTranslate = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 400],
  })

  const glowOpacity = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.8],
  })

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        {isCompleted && (
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
          colors={isCompleted ? [Colors.success[400], Colors.success[500]] : [Colors.primary[400], Colors.primary[500]]}
          style={styles.card}
        >
          {isCompleted && (
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX: shimmerTranslate }, { rotate: "-60deg" }],
                },
              ]}
            />
          )}
          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <View style={[styles.iconContainer, isCompleted && styles.completedIcon]}>
                <FontAwesome5 name={isCompleted ? "check" : "book-open"} size={16} color="#fff" />
              </View>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.rewardContainer}>
              <FontAwesome5 name="coins" size={12} color="#FFD700" />
              <Text style={styles.rewardText}>{reward}</Text>
            </View>
          </View>
          <Text style={styles.objective}>{objective}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progresso</Text>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }, isCompleted && styles.completedProgress]} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  glowContainer: {
    position: "absolute",
    borderRadius: 20,
    zIndex: -1,
  },
  card: {
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: [{ skewX: "-20deg" }],
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleRow: {
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
    marginRight: 8,
  },
  completedIcon: {
    backgroundColor: "#4CAF50",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  rewardText: {
    marginLeft: 4,
    color: "#fff",
    fontWeight: "bold",
  },
  objective: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
  completedProgress: {
    backgroundColor: "#4CAF50",
  },
})

export default MissionCard
