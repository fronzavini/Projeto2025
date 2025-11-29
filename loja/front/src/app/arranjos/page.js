"use client";

import Produto from "../components/produto";
import Banner from "../components/banner";
import Relevancia from "../components/relevancia";
import styles from "../styles/page.module.css";

import { arranjos } from "../data/arranjos.js";

export default function Home() {
  return (
    <div>
      <Banner
        imagem="/imgs/flores2.jpeg"
        titulo="Arranjos e Buquês"
        texto="Arranjos e buquês frescos, cheios de vida e perfeitos para presentear."
      />

      <div className={styles.containerFiltros}>
        <span className={styles.totalProdutos}>{arranjos.length} produtos</span>

        <div className={styles.filtros}>
          <Relevancia />
        </div>
      </div>

      <div className={styles.produtoGrid}>
        {arranjos.map((item) => (
          <Produto
            key={item.id}
            id={item.id}
            nome={item.nome}
            preco={item.preco}
            imagemPrincipal={item.imagemPrincipal}
          />
        ))}
      </div>
    </div>
  );
}
