import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/header";
import Nav from "./components/nav";

const slides = [
  { src: "/imgs/slider1.jpg", mobile: "/imgs/slider1-mobile.jpg" },
  { src: "/imgs/slider2.jpg", mobile: "/imgs/slider2-mobile.jpg" },
  { src: "/imgs/slider3.jpg", mobile: "/imgs/slider3-mobile.jpg" },
];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BellaDonna",
  description: "Floricultura BellaDonna",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Nav />
        <main>
          <Header slides={slides} interval={3000} />
          {children}
        </main>
      </body>
    </html>
  );
}
