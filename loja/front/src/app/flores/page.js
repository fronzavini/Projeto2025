"use client";

import { useEffect, useState } from "react";
import Produto from "../components/produto";
import Banner from "../components/banner";
import Relevancia from "../components/relevancia";
import styles from "../styles/page.module.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 12;
  const totalPagsVisiveis = 5;

  useEffect(() => {
    fetch("http://127.0.0.1:5000/listar_produtos")
      .then((res) => res.json())
      .then((data) => {
        const produtosFormatados = data
          .filter((produto) => produto[2]?.toLowerCase() === "flores")
          .map((produto) => ({
            id: produto[0],
            nome: produto[1],
            preco: produto[4],
            imagemPrincipal: produto[9],
          }));

        setProdutos(produtosFormatados);
      })
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  const indiceUltimoProduto = paginaAtual * produtosPorPagina;
  const indicePrimeiroProduto = indiceUltimoProduto - produtosPorPagina;
  const produtosPagina = produtos.slice(
    indicePrimeiroProduto,
    indiceUltimoProduto
  );

  const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);

  const mudarPagina = (numero) => {
    if (numero >= 1 && numero <= totalPaginas) {
      setPaginaAtual(numero);
      window.scrollTo(0, 0);
    }
  };

  const startPage = Math.max(
    1,
    paginaAtual - Math.floor(totalPagsVisiveis / 2)
  );
  const endPage = Math.min(totalPaginas, startPage + totalPagsVisiveis - 1);
  const paginasVisiveis = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div>
      <Banner
        imagem="/imgs/flores.jpeg"
        titulo="Flores avulsas"
        texto="Encontre aqui flores frescas e de qualidade: Rosas, Margaridas, Girassóis, Lírios e muito mais. Perfeitas para quem quer montar seu próprio presente ou decorar com um toque natural."
      />

      <div className={styles.container}>
        <div className={styles.containerFiltros}>
          <span className={styles.totalProdutos}>
            {produtos.length} produtos
          </span>
          <div className={styles.filtros}>
            <Relevancia />
          </div>
        </div>

        <div className={styles.produtoGrid}>
          {produtosPagina.map((item) => (
            <Produto
              key={item.id}
              id={item.id}
              nome={item.nome}
              preco={item.preco}
              imagemPrincipal={item.imagemPrincipal}
            />
          ))}
        </div>

        <div className={styles.paginacao}>
          {/* Texto acima */}
          <span className={styles.infoPaginacao}>Você está na página</span>

          {/* Botões de paginação */}
          <div className={styles.botoesPaginacao}>
            <button
              onClick={() => mudarPagina(paginaAtual - 1)}
              disabled={paginaAtual === 1}
              className={styles.botaoPagina}
            >
              &lt;
            </button>

            {paginasVisiveis.map((numero) => (
              <button
                key={numero}
                className={`${styles.botaoPagina} ${
                  paginaAtual === numero ? styles.paginaAtiva : ""
                }`}
                onClick={() => mudarPagina(numero)}
              >
                {numero}
              </button>
            ))}

            {endPage < totalPaginas && (
              <span className={styles.elipses}>...</span>
            )}

            {endPage < totalPaginas &&
              !paginasVisiveis.includes(totalPaginas) && (
                <button
                  className={styles.botaoPagina}
                  onClick={() => mudarPagina(totalPaginas)}
                >
                  {totalPaginas}
                </button>
              )}

            <button
              onClick={() => mudarPagina(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
              className={styles.botaoPagina}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
