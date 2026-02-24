"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/produtoSlider.module.css";

export default function ProdutoSlider() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [pos, setPos] = useState(0);
  const sliderRef = useRef(null);

  const larguraCard = 280;

  useEffect(() => {
    fetch("http://192.168.18.155:5000/listar_produtos")
      .then((res) => res.json())
      .then((data) => {
        const produtosFiltrados = data.filter(
          (p) => p[2]?.toLowerCase() === "flores"
        );
        const shuffled = produtosFiltrados.sort(() => 0.5 - Math.random());
        const selecionados = shuffled.slice(0, 5).map((p) => ({
          id: p[0],
          nome: p[1],
          subtitulo: p[2],
          preco: p[4],
          imagem: p[9],
        }));

        setProdutos([...selecionados, ...selecionados, ...selecionados]);
        setPos(selecionados.length);
      })
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  const irPara = (novo) => setPos(novo);
  const anterior = () => irPara(pos - 1);
  const proximo = () => irPara(pos + 1);

  useEffect(() => {
    if (!produtos.length) return;
    if (pos <= 0) {
      setTimeout(() => {
        if (!sliderRef.current) return;
        sliderRef.current.style.transition = "none";
        setPos(produtos.length / 3);
      }, 450);
    }
    if (pos >= produtos.length - 1) {
      setTimeout(() => {
        if (!sliderRef.current) return;
        sliderRef.current.style.transition = "none";
        setPos(produtos.length / 3 - 1);
      }, 450);
    }
  }, [pos, produtos]);

  useEffect(() => {
    if (!sliderRef.current) return;
    sliderRef.current.style.transition = "transform 0.45s ease";
  }, [pos]);

  const abrirDetalhe = (id) => {
    router.push(`/produtoDetalhe/${id}`); // redireciona para a página de detalhe
    window.scrollTo(690, 690);
  };

  return (
    <div className={styles.container}>
      <button className={styles.seta} onClick={anterior}>
        &lt;
      </button>

      <div className={styles.sliderWrapper}>
        <div
          ref={sliderRef}
          className={styles.slider}
          style={{ transform: `translateX(${-pos * larguraCard}px)` }}
        >
          {produtos.map((p, i) => (
            <div key={i} className={styles.card}>
              <img
                src={p.imagem}
                alt={p.nome}
                onClick={() => abrirDetalhe(p.id)}
                style={{ cursor: "pointer" }}
              />
              <p className={styles.nome}>
                {p.nome} — <span>{p.subtitulo}</span>
              </p>
              <p className={styles.preco}>{p.preco}</p>
            </div>
          ))}
        </div>
      </div>

      <button className={styles.seta} onClick={proximo}>
        &gt;
      </button>
    </div>
  );
}
