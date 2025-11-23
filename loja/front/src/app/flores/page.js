"use client";

import React from "react";
import Produto from "../components/produto";
import Banner from "../components/banner";
import Relevancia from "../components/relevancia";
import styles from "../styles/page.module.css";

export default function Home() {
  const handleAddToCart = (produto) => {
    alert(`Produto adicionado: ${produto.nome}`);
  };

  return (
    <div>
      <Banner
        imagem="/imgs/flores.jpg"
        titulo="Flores Avulsas"
        texto="Encontre aqui flores frescas e de qualidade: Rosas, Margaridas, Girassóis, Lírios e muito mais. Perfeitas para quem quer montar seu próprio presente ou decorar com um toque natural."
      />
      <div className={styles.containerFiltros}>
        <span className={styles.totalProdutos}>120 produtos</span>
        <div className={styles.filtros}>
          <Relevancia
            onChange={(valor) => {
              console.log("Ordenação escolhida:", valor);
              // preco-asc  ou  preco-desc
            }}
          />
        </div>
      </div>

      <div className={styles.produtoGrid}>
        <Produto
          nome="Copo-de-Leite - Flor Unitária"
          imagemPrincipal="/imgs/copo-de-leite.jpg"
          preco="10,00"
          addToCart={handleAddToCart}
        />

        <Produto
          nome="Copo-de-Leite - Flor Unitária"
          imagemPrincipal="/imgs/copo-de-leite.jpg"
          preco="10,00"
          addToCart={handleAddToCart}
        />

        <Produto
          nome="Copo-de-Leite - Flor Unitária"
          imagemPrincipal="/imgs/copo-de-leite.jpg"
          preco="10,00"
          addToCart={handleAddToCart}
        />

        <Produto
          nome="Copo-de-Leite - Flor Unitária"
          imagemPrincipal="/imgs/copo-de-leite.jpg"
          preco="10,00"
          addToCart={handleAddToCart}
        />

        <Produto
          nome="Copo-de-Leite - Flor Unitária"
          imagemPrincipal="/imgs/copo-de-leite.jpg"
          preco="10,00"
          addToCart={handleAddToCart}
        />

        <Produto
          nome="Copo-de-Leite - Flor Unitária"
          imagemPrincipal="/imgs/copo-de-leite.jpg"
          preco="10,00"
          addToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
