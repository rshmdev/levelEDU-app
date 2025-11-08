import { User } from "@/providers/AuthProvider";

export interface Mission {
  title: string;
  description: string;
  coins: number;
  allowedUsers: any[];
  updatedAt: string;
  createdAt: string;
  __v: number;
  _id: string;
}

export interface CompletedMissionRes {
  user?: User;
  newLevel?: string;
  message: string;
  error?: string;
}
