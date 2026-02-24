// src/app/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import Banner from "./components/banner";
import Produto from "./components/produto";
import ProdutoSlider from "./components/produtoSlider";

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://192.168.18.155:5000";

export default function Home() {
  const [novidades, setNovidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/listar_produtos`)
      .then((r) => r.json())
      .then((data) => {
        const itens = (data || [])
          .filter((p) => p?.length >= 10)
          .slice(0, 8)
          .map((p) => ({
            id: p[0],
            nome: p[1],
            preco: p[4],
            imagem: p[9],
          }));
        setNovidades(itens);
      })
      .catch((e) => console.error("Erro ao carregar produtos:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={styles.page}>
      {/* slider de destaques */}
      <section style={styles.section}>
        <div style={styles.sectionHead}></div>
        <ProdutoSlider />
      </section>
    </main>
  );
}

// estilos simples e com respiro
const styles = {
  page: {
    background: "#fff",
    color: "#111",
    lineHeight: 1.5,
  },
  sectionWide: {
    maxWidth: 1120,
    margin: "40px auto 8px",
    padding: "0 16px",
  },
  section: {
    maxWidth: 1120,
    margin: "60px auto",
    padding: "0 16px",
  },
  sectionHead: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  h2: { fontSize: 20, fontWeight: 600 },
  linkSutil: {
    fontSize: 14,
    color: "#6b7280",
    textDecoration: "none",
  },
  grid: {
    display: "grid",
    gap: 32, // espaço entre os cards
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  },
  cardWrapper: {
    padding: 8, // respiro extra ao redor do card
  },
  hint: { color: "#6b7280", fontSize: 14 },
};
