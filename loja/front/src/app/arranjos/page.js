"use client";

import React from "react";
import Produto from "../components/produto";
import Banner from "../components/banner";
import Filtro from "../components/filtro";
import Relevancia from "../components/relevancia";
import styles from "../styles/page.module.css";

export default function Home() {
  const handleAddToCart = (produto) => {
    alert(`Produto adicionado: ${produto.nome}`);
  };

  return (
    <div>
      <Banner
        imagem="/imgs/flores2.jpeg"
        titulo="Arranjos e buquês"
        texto="Encontre aqui buquês e arranjos frescos, cheios de cores e vida. Perfeitos para presentear ou decorar com charme natural. "
      />
      <div className={styles.containerFiltros}>
        <span className={styles.totalProdutos}>120 produtos</span>
        <div className={styles.filtros}>
          <Filtro />
          <Relevancia />
        </div>
      </div>

      <Produto
        nome="Copo-de-Leite - Buquê"
        imagemPrincipal="/imgs/copo-de-leite.jpg"
        preco="10,00"
        addToCart={handleAddToCart}
      />
    </div>
  );
}
