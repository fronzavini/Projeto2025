"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/produtoSlider.module.css";

const produtos = [
  {
    id: 1,
    nome: "Copo-de-Leite",
    subtitulo: "Flor Unitária",
    preco: "R$ 10,00",
    imagem:
      "https://i.pinimg.com/736x/a0/f6/57/a0f657941c33f721fd57c0c93fec7d39.jpg",
  },
  {
    id: 2,
    nome: "Dália",
    subtitulo: "Flor Unitária",
    preco: "R$ 7,90",
    imagem:
      "https://i.pinimg.com/736x/5b/a3/b5/5ba3b51339575c16e9a4c238f62766ee.jpg",
  },
  {
    id: 3,
    nome: "Lírio",
    subtitulo: "Flor Unitária",
    preco: "R$ 15,00",
    imagem:
      "https://i.pinimg.com/736x/e8/15/88/e81588e63c458185cae31c64c13b2b29.jpg",
  },
  {
    id: 4,
    nome: "Orquidea",
    subtitulo: "Flor Unitária",
    preco: "R$ 12,00",
    imagem:
      "https://i.pinimg.com/736x/0e/44/8d/0e448d5f0466747c7a6f52f8afb8a6a0.jpg",
  },
  {
    id: 5,
    nome: "Tulipa Vermelha",
    subtitulo: "Flor Unitária",
    preco: "R$ 8,50",
    imagem:
      "https://i.pinimg.com/736x/e7/fb/76/e7fb7654d43f58fa8bfcd3e7e175528b.jpg",
  },
];

// duplicamos para loop infinito
const loopData = [...produtos, ...produtos, ...produtos];

export default function ProdutoSlider() {
  const [pos, setPos] = useState(produtos.length); // começa no meio
  const sliderRef = useRef(null);

  const larguraCard = 280; // card + gap

  const irPara = (novo) => {
    setPos(novo);
  };

  const anterior = () => {
    irPara(pos - 1);
  };

  const proximo = () => {
    irPara(pos + 1);
  };

  // reset suave p/ loop infinito
  useEffect(() => {
    if (pos <= 1) {
      setTimeout(() => {
        if (!sliderRef.current) return;
        sliderRef.current.style.transition = "none";
        setPos(produtos.length + 1);
      }, 450);
    }

    if (pos >= loopData.length - 2) {
      setTimeout(() => {
        if (!sliderRef.current) return;
        sliderRef.current.style.transition = "none";
        setPos(produtos.length - 2);
      }, 450);
    }
  }, [pos]);

  useEffect(() => {
    if (!sliderRef.current) return;
    sliderRef.current.style.transition = "transform 0.45s ease";
  }, [pos]);

  return (
    <div className={styles.container}>
      <button className={styles.seta} onClick={anterior}>
        &lt;
      </button>

      <div className={styles.sliderWrapper}>
        <div
          ref={sliderRef}
          className={styles.slider}
          style={{
            transform: `translateX(${-pos * larguraCard}px)`,
          }}
        >
          {loopData.map((p, i) => (
            <div key={i} className={styles.card}>
              <img src={p.imagem} alt={p.nome} />
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
