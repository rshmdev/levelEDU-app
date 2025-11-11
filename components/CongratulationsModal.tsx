"use client"

import React from "react"
import { Modal, View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Pressable } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"

interface CongratulationsModalProps {
  visible: boolean
  onClose: () => void
  reward: number
  title: string
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({ visible, onClose, reward, title }) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current
  const rotateValue = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateValue, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(rotateValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]).start()
    } else {
      scaleValue.setValue(0)
    }
  }, [visible])

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const handleBackdropPress = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose())
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={handleBackdropPress}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <Pressable>
            <LinearGradient
              colors={[`${Colors.primary[700]}F2`, `${Colors.primary[600]}F2`]}
              style={styles.gradientContainer}
            >
              <TouchableOpacity style={styles.closeButton} onPress={handleBackdropPress}>
                <FontAwesome5 name="times" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.starContainer}>
                <Animated.View style={[styles.star, { transform: [{ rotate: spin }] }]}>
                  <FontAwesome5 name="star" size={50} color="#FFD700" solid />
                </Animated.View>
              </View>
              <Text style={styles.congratsText}>Parabéns!</Text>
              <Text style={styles.missionText}>{title}</Text>
              <View style={styles.rewardContainer}>
                <FontAwesome5 name="coins" size={24} color="#FFD700" />
                <Text style={styles.rewardText}>+{reward}</Text>
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleBackdropPress}>
                <Text style={styles.continueText}>Continuar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </Pressable>
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
  modalContent: {
    width: "80%",
    maxWidth: 340,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientContainer: {
    padding: 24,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  starContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  star: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  missionText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 16,
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  rewardText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginLeft: 8,
  },
  messageContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  message: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: "100%",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default CongratulationsModal
