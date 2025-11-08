import api from "@/lib/api";
import { User } from "@/providers/AuthProvider";
import { Attitude } from "@/types/attitudes";

export async function getUserAttitudes(userId: string) {
  const res = await api.get(`/attitudes/${userId}`);

  return res.data as Attitude[];
}

export async function claimAttitude(userId: string, attitudeId: string) {
  const res = await api.put(`/attitudes/${userId}/${attitudeId}/claim`);

  return res.data as {
    message: string;
    user?: User;
    error?: string;
  };
}
