"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cards from "../components/cards";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
  return (
    <div>
      <Cards />
    </div>
  );
}
