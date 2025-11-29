"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Nav from "./components/nav";
import Footer from "./components/footer";
import { usePathname } from "next/navigation";

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

  // ✔ Agora funciona para /pedido, /pedido/1, /pedido/qualquer-coisa
  const ocultarNavHeader =
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/pedido") ||
    pathname.startsWith("/carrinho");

  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GoogleOAuthProvider clientId="819591199026-d18qd05o0mak6n4hvd6lrcg449kq938j.apps.googleusercontent.com">
          {!ocultarNavHeader && <Nav />}
          <main>
            {!ocultarNavHeader && <Header slides={slides} interval={3000} />}
            {children}
          </main>
          {!ocultarNavHeader && <Footer />}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
