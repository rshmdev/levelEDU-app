import api from "@/lib/api";
import { CompletedMissionRes, Mission } from "@/types/mission";

export async function getMissions(userId: string) {
  const res = await api.get(`/missions/${userId}/available`);

  return res.data as Mission[];
}

export async function completeMission(
  userId: string,
  missionId: string
) {
  const res = await api.put(`/missions/${userId}/${missionId}/complete`);

  return res.data as CompletedMissionRes;
}
