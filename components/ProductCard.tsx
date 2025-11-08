import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  category: string;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, description, price, category, onPress }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Material':
        return 'pencil-alt';
      case 'Experiências':
        return 'star';
      case 'Privilégios':
        return 'crown';
      default:
        return 'gift';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.productCard, { transform: [{ scale: scaleValue }] }]}>
        <LinearGradient
          colors={['rgba(124, 58, 237, 0.8)', 'rgba(139, 92, 246, 0.8)']}
          style={styles.productGradient}
        >
          <View style={styles.categoryIconContainer}>
            <FontAwesome5 name={getCategoryIcon(category)} size={16} color="#FFD700" />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.productName} numberOfLines={2}>{name}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>{description}</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <FontAwesome5 name="coins" size={16} color="#FFD700" />
              <Text style={styles.productPrice}>{price}</Text>
            </View>
            <View style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Comprar</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryIconContainer: {
    position: 'absolute',
    top: 3,
    right: 3,
    borderRadius: 12,
    padding: 6,
  },
  contentContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  buyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProductCard;
