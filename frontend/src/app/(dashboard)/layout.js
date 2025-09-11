import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({ children }) {
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
