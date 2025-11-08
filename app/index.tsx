import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginScreen from "./(auth)/login";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname(); // Obtém o caminho atual
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log(user, pathname)
    // Verifica se o primeiro segmento é o de autenticação e redireciona para / (app)
    if (user && isMounted && pathname === "/") {
      router.push("/(app)");
    }
  }, [user, isMounted, pathname]);

  return <LoginScreen />;
}
