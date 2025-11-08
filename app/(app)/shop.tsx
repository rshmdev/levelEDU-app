import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { TabsView } from "@/components/TabsView";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, purchaseProduct } from "@/service/shop";
import { Product } from "@/types/products";
import PurchaseConfirmationModal from "@/components/PurchaseConfirmationModal";
import { useAuth } from "@/hooks/useAuth";
import Toast from "react-native-toast-message";

const categories = ["Todos", "Material", "Experiências", "Privilégios"];

const ShopScreen: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);
  const [purchasedProduct, setPurchasedProduct] = useState("");

  const queryClient = useQueryClient();
  const { data: products } = useQuery({
    queryFn: () => getProducts(user?._id || ''),
    queryKey: ["shop-products", user],
    enabled: !!user
  });

  const { mutateAsync } = useMutation({
    mutationFn: (product: Product) =>
      purchaseProduct(user?._id || "", product._id),
    onSuccess: (data: any) => {
      setPurchasedProduct(data?.purchase?.productId?.name);
      setIsPurchaseModalVisible(true);
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
      updateUser();

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: data.message,
        position: "bottom",
      });
    },
    onError: (error: any) => {
      const apiErrorMessage =
        error?.response?.data?.message || "Erro ao efetuar compra!";

      Toast.show({
        type: "error",
        text1: "Erro",
        text2: apiErrorMessage,
        position: "bottom",
      });
    },
  });

  const filteredProducts = products?.filter(
    (product) =>
      (selectedCategory === "Todos" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePurchase = async (product: Product) => {
    try {
      await mutateAsync(product);
    } catch (error: any) {
      ToastAndroid.show(error.message, 2500);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productWrapper}>
      <ProductCard
        name={item.name}
        description={item.description}
        price={item.price}
        category={item.category}
        onPress={() => handlePurchase(item)}
      />
    </View>
  );

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <TabsView>
      <Header />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Loja</Text>
        </View>

        <View style={styles.searchContainer}>
          <FontAwesome5
            name="search"
            size={18}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
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
        />
        <PurchaseConfirmationModal
          isVisible={isPurchaseModalVisible}
          onClose={() => setIsPurchaseModalVisible(false)}
          productName={purchasedProduct}
        />
      </View>
    </TabsView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    gap: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d8b4e2",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#fff",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedCategory: {
    backgroundColor: "#bc96e6",
  },
  categoryText: {
    color: "#fff",
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#210b2c",
  },
  productRow: {
    justifyContent: "space-between",
  },
  productWrapper: {
    width: "48%",
    marginBottom: 16,
  },
});

export default ShopScreen;
