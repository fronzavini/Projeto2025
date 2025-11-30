"use client";

import { useEffect, useState } from "react";
import Produto from "../components/produto";
import Banner from "../components/banner";
import Relevancia from "../components/relevancia";
import styles from "../styles/page.module.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/listar_produtos")
      .then((res) => res.json())
      .then((data) => {
        // data = array de arrays:
        // [id, nome, categoria, marca, preco, qtd_estoque, estoque_min, estado, fornecedor_id, imagem_1, imagem_2, imagem_3]
        const produtosFormatados = data
          .filter((produto) => produto[2]?.toLowerCase() === "flores") // categoria = índice 2
          .map((produto) => ({
            id: produto[0],
            nome: produto[1],
            preco: produto[4],
            imagemPrincipal: produto[9], // só a imagem 1
          }));

        setProdutos(produtosFormatados);
      })
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  return (
    <div>
      <Banner
        imagem="/imgs/flores2.jpeg"
        titulo="Arranjos e Buquês"
        texto="Arranjos e buquês frescos, cheios de vida e perfeitos para presentear."
      />

      <div className={styles.containerFiltros}>
        <span className={styles.totalProdutos}>{produtos.length} produtos</span>

        <div className={styles.filtros}>
          <Relevancia />
        </div>
      </div>

      <div className={styles.produtoGrid}>
        {produtos.map((item) => (
          <Produto
            key={item.id}
            id={item.id}
            nome={item.nome}
            preco={item.preco}
            imagemPrincipal={item.imagemPrincipal} // só a imagem principal
          />
        ))}
      </div>
    </div>
  );
}
