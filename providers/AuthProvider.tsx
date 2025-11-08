import api from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState } from "react";

export interface User {
  __v: number;
  _id: string;
  coins: number;
  completedMissions: string[];
  createdAt: string;
  name: string;
  qrcode: string;
  updatedAt: string;
  xp: number;
}

interface AuthContextData {
  user: User | null;
  setUser: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: () => Promise<void>;
  loading: boolean
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = async (forceUpdate: boolean = false) => {
    // Evita atualizações redundantes se o usuário não estiver logado
    if (!user && !forceUpdate) return;

    try {
      const userId = user?._id || (await AsyncStorage.getItem("@userId"));
      if (!userId) return;

      // Chama o backend para obter dados atualizados
      const response = await api.get(`/users/${userId}/revalidate`);
      if (!response?.data?.user) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      const updatedUser = response.data.user;

      // Atualiza o estado e o armazenamento localz
      console.log(updatedUser)
      setUser(updatedUser);
      await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
    }
  };

  const saveUserToStorage = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem("@user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@user");
  };

  React.useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      }

      
      // Atualiza o usuário logo após carregar do armazenamento
      await updateUser(true); // Força atualização inicial
      setLoading(false);
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser: saveUserToStorage, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
