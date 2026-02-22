"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Nav from "./components/nav";
import Footer from "./components/footer";
import { usePathname } from "next/navigation";
import { CarrinhoProvider } from "../app/context/carrinhoContext"; // <<-- 1. IMPORTADO O PROVIDER

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const slides = [
  { src: "/imgs/slider1.jpg", mobile: "/imgs/slider1-mobile.jpg" },
  { src: "/imgs/slider2.jpg", mobile: "/imgs/slider2-mobile.jpg" },
  { src: "/imgs/slider3.jpg", mobile: "/imgs/slider3-mobile.jpg" },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 2. ADICIONADO /checkout para ocultar Nav e Header em páginas de finalização
  const ocultarNavHeader =
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/pedido") ||
    pathname.startsWith("/carrinho") ||
    pathname.startsWith("/checkout"); // <<-- NOVO

  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* 3. ENVOLVENDO O CONTEÚDO PRINCIPAL COM O CarrinhoProvider */}
        <CarrinhoProvider>
          <GoogleOAuthProvider clientId="819591199026-d18qd05o0mak6n4hvd6lrcg449kq938j.apps.googleusercontent.com">
            {!ocultarNavHeader && <Nav />}
            <main>
              {!ocultarNavHeader && <Header slides={slides} interval={3000} />}
              {children}
            </main>
            {!ocultarNavHeader && <Footer />}
          </GoogleOAuthProvider>
        </CarrinhoProvider>
      </body>
    </html>
  );
}
