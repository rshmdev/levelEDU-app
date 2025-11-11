import api from "@/lib/api";
import { Product } from "@/types/products";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getProducts(userId: string) {
  const res = await api.get(`/products/${userId}`);

  return res.data as Product[];
}

export async function purchaseProduct(userId: string, productId: string) {
  // Buscar tenantId do AsyncStorage
  const tenantId = await AsyncStorage.getItem("@tenantId");
  
  const res = await api.post("/purchases", {
    userId,
    productId,
    tenantId, // Incluir tenantId no body
  });

  return res.data as Product[];
}
