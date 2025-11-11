"use client"

import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FontAwesome5 } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

interface ProductCardProps {
  name: string
  description: string
  price: number
  category: string
  onPress: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ name, description, price, category, onPress }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Material":
        return "pencil-alt"
      case "Experiências":
        return "star"
      case "Privilégios":
        return "crown"
      default:
        return "gift"
    }
  }

  return (
    <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
      <Animated.View style={[styles.productCard, { transform: [{ scale: scaleValue }] }]}>
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.productGradient}
        >
          <View style={styles.categoryBadge}>
            <FontAwesome5 name={getCategoryIcon(category)} size={14} color={Colors.warning[400]} />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.productName} numberOfLines={2}>
              {name}
            </Text>
            <Text style={styles.productDescription} numberOfLines={3}>
              {description}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <FontAwesome5 name="coins" size={16} color={Colors.warning[400]} />
              <Text style={styles.productPrice}>{price}</Text>
            </View>
            <TouchableOpacity style={styles.buyButton} onPress={onPress}>
              <Text style={styles.buyButtonText}>Comprar</Text>
              <FontAwesome5 name="shopping-cart" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  productCard: {
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  productGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: Colors.primary[600],
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 12,
    padding: 8,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 8,
    paddingRight: 50,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "column",
    alignItems: "stretch",
    marginTop: 12,
    gap: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.warning[400],
  },
  buyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buyButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default ProductCard
