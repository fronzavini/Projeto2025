"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cards from "../components/cards";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Se não houver token, redireciona para login
    if (!token) {
      router.push("/login");
      return;
    }

    // Se quiser, pode validar o token (opcional)
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decodifica payload do JWT
      const exp = payload.exp * 1000; // exp vem em segundos, converte para ms
      if (Date.now() > exp) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch (err) {
      console.error("Token inválido:", err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <Cards />
    </div>
  );
}
