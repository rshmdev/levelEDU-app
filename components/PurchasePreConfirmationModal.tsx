"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { FontAwesome5 } from "@expo/vector-icons"
import type { Product } from "@/types/products"

interface PurchasePreConfirmationModalProps {
  isVisible: boolean
  onClose: () => void
  onConfirm: () => void
  product: Product | null
  userCoins: number
  isLoading?: boolean
}

const PurchasePreConfirmationModal: React.FC<PurchasePreConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  product,
  userCoins,
  isLoading = false,
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start()
    } else {
      scaleValue.setValue(0)
    }
  }, [isVisible, scaleValue])

  if (!product) return null

  const hasEnoughCoins = userCoins >= product.price
  const coinsAfterPurchase = userCoins - product.price

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalContent}
          >
            {/* Decorative circles */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />

            <View style={styles.iconContainer}>
              <FontAwesome5 name="shopping-cart" size={40} color="#fff" />
            </View>

            <Text style={styles.title}>Confirmar Compra?</Text>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
            </View>

            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Preço:</Text>
                <View style={styles.coinsBadge}>
                  <FontAwesome5 name="coins" size={16} color="#FFD700" />
                  <Text style={styles.priceValue}>{product.price}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Suas moedas:</Text>
                <View style={styles.coinsBadge}>
                  <FontAwesome5 name="coins" size={16} color="#FFD700" />
                  <Text style={styles.priceValue}>{userCoins}</Text>
                </View>
              </View>

              {hasEnoughCoins && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, styles.remainingLabel]}>Restante:</Text>
                    <View style={styles.coinsBadge}>
                      <FontAwesome5 name="coins" size={16} color="#FFD700" />
                      <Text style={[styles.priceValue, styles.remainingValue]}>{coinsAfterPurchase}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {!hasEnoughCoins && (
              <View style={styles.warningBox}>
                <FontAwesome5 name="exclamation-triangle" size={16} color="#ff6b6b" />
                <Text style={styles.warningText}>Moedas insuficientes! Faltam {product.price - userCoins} moedas.</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={isLoading}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton, (!hasEnoughCoins || isLoading) && styles.disabledButton]}
                onPress={onConfirm}
                disabled={!hasEnoughCoins || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <FontAwesome5 name="check" size={16} color="#fff" />
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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
    padding: 24,
    alignItems: "center",
    position: "relative",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle1: {
    width: 100,
    height: 100,
    top: -30,
    right: -30,
  },
  circle2: {
    width: 60,
    height: 60,
    bottom: 40,
    left: -20,
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: -20,
    right: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  productInfo: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  productDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 20,
  },
  priceSection: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  remainingLabel: {
    color: "#fff",
    fontWeight: "700",
  },
  coinsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
  remainingValue: {
    color: "#4ade80",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 12,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  warningText: {
    flex: 1,
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  confirmButton: {
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    flexDirection: "row",
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    opacity: 0.5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PurchasePreConfirmationModal
