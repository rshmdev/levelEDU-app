"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { FontAwesome5 } from "@expo/vector-icons"

interface AttitudeRewardModalProps {
  isVisible: boolean
  onClose: () => void
  attitude: {
    title: string
    isPositive: boolean
    coins: number
    xp: number
  }
}

const AttitudeRewardModal: React.FC<AttitudeRewardModalProps> = ({ isVisible, onClose, attitude }) => {
  const scaleValue = useRef(new Animated.Value(0)).current
  const rotateValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isVisible, scaleValue, rotateValue])

  const getRewardText = () => {
    if (attitude.isPositive) {
      if (attitude.coins > 0 && attitude.xp > 0) {
        return `Você ganhou ${attitude.coins} moedas e ${attitude.xp} XP!`
      } else if (attitude.coins > 0) {
        return `Você ganhou ${attitude.coins} moedas!`
      } else if (attitude.xp > 0) {
        return `Você ganhou ${attitude.xp} XP!`
      }
    } else {
      if (attitude.coins < 0 && attitude.xp < 0) {
        return `Você perdeu ${Math.abs(attitude.coins)} moedas e ${Math.abs(attitude.xp)} XP.`
      } else if (attitude.coins < 0) {
        return `Você perdeu ${Math.abs(attitude.coins)} moedas.`
      } else if (attitude.xp < 0) {
        return `Você perdeu ${Math.abs(attitude.xp)} XP.`
      }
    }
    return ""
  }

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <LinearGradient
            colors={attitude.isPositive ? [Colors.success[400], Colors.success[500], Colors.success[600]] : [Colors.error[400], Colors.error[500], Colors.error[600]]}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <Animated.View style={[styles.iconContainer, { transform: [{ rotate }] }]}>
              <FontAwesome5 name={attitude.isPositive ? "smile" : "frown"} size={50} color="#fff" />
            </Animated.View>

            <Text style={styles.titleText}>{attitude.isPositive ? "Parabéns!" : "Atenção!"}</Text>

            <View style={styles.attitudeBadge}>
              <FontAwesome5 name={attitude.isPositive ? "thumbs-up" : "exclamation-triangle"} size={16} color="#fff" />
              <Text style={styles.attitudeText}>{attitude.title}</Text>
            </View>

            <View style={styles.rewardsContainer}>
              {attitude.coins !== 0 && (
                <View style={styles.rewardCard}>
                  <View style={styles.rewardIconBg}>
                    <FontAwesome5 name="coins" size={20} color="#FFD700" />
                  </View>
                  <Text style={styles.rewardLabel}>Moedas</Text>
                  <Text style={styles.rewardValue}>
                    {attitude.coins > 0 ? "+" : ""}
                    {attitude.coins}
                  </Text>
                </View>
              )}
              {attitude.xp !== 0 && (
                <View style={styles.rewardCard}>
                  <View style={styles.rewardIconBg}>
                    <FontAwesome5 name="star" size={20} color="#FFD700" />
                  </View>
                  <Text style={styles.rewardLabel}>Experiência</Text>
                  <Text style={styles.rewardValue}>
                    {attitude.xp > 0 ? "+" : ""}
                    {attitude.xp} XP
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.messageText}>
              {attitude.isPositive ? "Continue com o bom trabalho!" : "Vamos melhorar na próxima vez!"}
            </Text>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <LinearGradient
                colors={["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)"]}
                style={styles.closeButtonGradient}
              >
                <Text style={styles.closeButtonText}>Continuar</Text>
                <FontAwesome5 name="arrow-right" size={14} color={Colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: Dimensions.get("window").width * 0.85,
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
  },
  modalContent: {
    padding: 32,
    alignItems: "center",
    position: "relative",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  attitudeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    gap: 8,
  },
  attitudeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  rewardsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    width: "100%",
  },
  rewardCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  rewardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  rewardLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  closeButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  closeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AttitudeRewardModal
