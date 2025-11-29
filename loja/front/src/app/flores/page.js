"use client";

import Produto from "../components/produto";
import Banner from "../components/banner";
import Relevancia from "../components/relevancia";
import styles from "../styles/page.module.css";
import { produtos } from "../data/produtos.js";

export default function Home() {
  return (
    <div>
      <Banner
        imagem="/imgs/flores.jpg"
        titulo="Flores Avulsas"
        texto="Encontre flores frescas e selecionadas."
      />

      <div className={styles.containerFiltros}>
        <span className={styles.totalProdutos}>{produtos.length} produtos</span>
        <div className={styles.filtros}>
          <Relevancia />
        </div>
      </div>

      <div className={styles.produtoGrid}>
        {produtos.map((p) => (
          <Produto
            key={p.id}
            id={p.id}
            nome={p.nome}
            preco={p.preco}
            imagemPrincipal={p.imagemPrincipal}
          />
        ))}
      </div>
    </div>
  );
}
