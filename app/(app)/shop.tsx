"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { TabsView } from "@/components/TabsView"
import Header from "@/components/Header"
import ProductCard from "@/components/ProductCard"
import { router } from "expo-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProducts, purchaseProduct } from "@/service/shop"
import type { Product } from "@/types/products"
import PurchaseConfirmationModal from "@/components/PurchaseConfirmationModal"
import PurchasePreConfirmationModal from "@/components/PurchasePreConfirmationModal"
import { useAuth } from "@/hooks/useAuth"
import { Colors } from "@/constants/Colors"

const categories = ["Todos", "Material", "Experiências", "Privilégios"]

const ShopScreen: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false)
  const [isPreConfirmModalVisible, setIsPreConfirmModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [purchasedProduct, setPurchasedProduct] = useState("")

  const queryClient = useQueryClient()
  const { data: products } = useQuery({
    queryFn: () => getProducts(user?._id || ""),
    queryKey: ["shop-products", user],
    enabled: !!user,
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (product: Product) => purchaseProduct(user?._id || "", product._id),
    onSuccess: (data: any) => {
      setPurchasedProduct(data?.purchase?.productId?.name)
      setIsPurchaseModalVisible(true)
      queryClient.invalidateQueries({ queryKey: ["shop-products"] })
      updateUser()
    },
    onError: (error: any) => {
      // Erro já é tratado pelo modal
    },
  })

  const filteredProducts = products?.filter(
    (product) =>
      (selectedCategory === "Todos" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product)
    setIsPreConfirmModalVisible(true)
  }

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return

    setIsPreConfirmModalVisible(false)

    try {
      await mutateAsync(selectedProduct)
    } catch (error: any) {
      // Handle error here
    }
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productWrapper}>
      <ProductCard
        name={item.name}
        description={item.description}
        price={item.price}
        category={item.category}
        onPress={() => handleProductPress(item)}
      />
    </View>
  )

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === item && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>{item}</Text>
    </TouchableOpacity>
  )

  return (
    <TabsView>
      <View style={styles.container}>
        <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <FontAwesome5 name="arrow-left" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Loja</Text>
              <Text style={styles.subtitle}>Troque suas moedas por recompensas</Text>
            </View>
          </View>

          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <FontAwesome5 name="shopping-bag" size={14} color="#bc96e6" />
              <Text style={styles.statText}>{filteredProducts?.length || 0} Produtos</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome5 name="coins" size={14} color="#FFD700" />
              <Text style={styles.statText}>{user?.coins || 0} Moedas</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="shopping-bag" size={60} color="rgba(188, 150, 230, 0.3)" />
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? "Tente buscar por outro termo" : "Aguarde novos produtos"}
              </Text>
            </View>
          }
        />

        <PurchasePreConfirmationModal
          isVisible={isPreConfirmModalVisible}
          onClose={() => setIsPreConfirmModalVisible(false)}
          onConfirm={handleConfirmPurchase}
          product={selectedProduct}
          userCoins={user?.coins || 0}
          isLoading={isPending}
        />

        <PurchaseConfirmationModal
          isVisible={isPurchaseModalVisible}
          onClose={() => setIsPurchaseModalVisible(false)}
          productName={purchasedProduct}
        />
      </View>
    </TabsView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerGradient: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#bc96e6",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
  },
  statsBar: {
    flexDirection: "row",
    gap: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  statText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: "#fff",
    fontSize: 15,
  },
  categoriesContainer: {
    marginBottom: 14,
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedCategory: {
    backgroundColor: "#bc96e6",
  },
  categoryText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
    fontSize: 13,
  },
  selectedCategoryText: {
    color: "#fff",
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 4,
  },
  productWrapper: {
    width: "48%",
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
})

export default ShopScreen
