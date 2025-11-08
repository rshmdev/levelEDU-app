import api from "@/lib/api";
import { User } from "@/providers/AuthProvider";

export async function getCoinsRanking() {
  const res = await api.get(`/ranking/coins`);

  return res.data as User[];
}

export async function getXpRanking() {
  const res = await api.get(`/ranking/xp`);

  return res.data as User[];
}
