import api from "@/lib/api";
import { Product } from "@/types/products";

export async function getProducts(userId: string) {
  const res = await api.get(`/products/${userId}`);

  return res.data as Product[];
}

export async function purchaseProduct(userId: string, productId: string) {
  const res = await api.post("/purchases", {
    userId,
    productId,
  });

  return res.data as Product[];
}
