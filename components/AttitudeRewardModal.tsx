import type React from "react"
import { useRef, useEffect } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
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

  useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.spring(scaleValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible, scaleValue]) // Added scaleValue to dependencies

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

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <LinearGradient
            colors={attitude.isPositive ? ["#4CAF50", "#45a049"] : ["#ff3b30", "#dc3545"]}
            style={styles.modalContent}
          >
            <FontAwesome5 name={attitude.isPositive ? "smile" : "frown"} size={50} color="#fff" style={styles.icon} />
            <Text style={styles.titleText}>{attitude.isPositive ? "Parabéns!" : "Atenção!"}</Text>
            <Text style={styles.attitudeText}>{attitude.title}</Text>
            <Text style={styles.rewardText}>{getRewardText()}</Text>
            <Text style={styles.messageText}>
              {attitude.isPositive ? "Continue com o bom trabalho!" : "Vamos melhorar na próxima vez!"}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Fechar</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: Dimensions.get("window").width * 0.8,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  icon: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  attitudeText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  rewardText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AttitudeRewardModal

