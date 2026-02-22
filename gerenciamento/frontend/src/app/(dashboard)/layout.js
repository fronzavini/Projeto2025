"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // converte para ms
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
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Header />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "20px" }}>{children}</main>
      </div>
    </div>
  );
}
