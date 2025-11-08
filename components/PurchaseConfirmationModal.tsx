import type React from "react"
import { useRef, useEffect } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FontAwesome5 } from "@expo/vector-icons"

interface PurchaseConfirmationModalProps {
  isVisible: boolean
  onClose: () => void
  productName: string
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({ isVisible, onClose, productName }) => {
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

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <LinearGradient colors={["#210b2c", "#55286f"]} style={styles.modalContent}>
            <FontAwesome5 name="check-circle" size={50} color="#4CAF50" style={styles.icon} />
            <Text style={styles.congratsText}>Parabéns pela sua compra!</Text>
            <Text style={styles.productText}>Você adquiriu: {productName}</Text>
            <Text style={styles.infoText}>O professor irá procurá-lo em breve para entregar o seu produto.</Text>
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
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  productText: {
    fontSize: 18,
    color: "#bc96e6",
    textAlign: "center",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#bc96e6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  closeButtonText: {
    color: "#210b2c",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PurchaseConfirmationModal

