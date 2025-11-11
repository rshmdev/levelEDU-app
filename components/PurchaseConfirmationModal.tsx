"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { FontAwesome5 } from "@expo/vector-icons"

interface PurchaseConfirmationModalProps {
  isVisible: boolean
  onClose: () => void
  productName: string
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({ isVisible, onClose, productName }) => {
  const scaleValue = useRef(new Animated.Value(0)).current
  const rotateValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      scaleValue.setValue(0)
      rotateValue.setValue(0)
    }
  }, [isVisible, scaleValue, rotateValue])

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <LinearGradient
            colors={[Colors.success[400], Colors.success[500], Colors.success[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalContent}
          >
            {/* Decorative circles */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />

            <Animated.View style={[styles.iconContainer, { transform: [{ rotate }] }]}>
              <FontAwesome5 name="check-circle" size={60} color="#fff" />
            </Animated.View>

            <Text style={styles.congratsText}>Compra Realizada!</Text>

            <View style={styles.productBox}>
              <FontAwesome5 name="gift" size={24} color="#FFD700" />
              <Text style={styles.productLabel}>Você adquiriu:</Text>
              <Text style={styles.productName}>{productName}</Text>
            </View>

            <View style={styles.infoBox}>
              <FontAwesome5 name="info-circle" size={20} color="#fff" style={styles.infoIcon} />
              <Text style={styles.infoText}>O professor irá procurá-lo em breve para entregar o seu produto.</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Fechar</Text>
              <FontAwesome5 name="times" size={16} color="#fff" />
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
    padding: 20,
  },
  modalContainer: {
    width: Dimensions.get("window").width * 0.9,
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
  },
  modalContent: {
    padding: 28,
    alignItems: "center",
    position: "relative",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  circle1: {
    width: 120,
    height: 120,
    top: -40,
    right: -40,
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: 60,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: -30,
    right: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  productBox: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  productLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 12,
    marginBottom: 6,
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default PurchaseConfirmationModal
