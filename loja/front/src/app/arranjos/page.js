"use client";

import { useEffect, useState } from "react";
import Produto from "../components/produto";
import Banner from "../components/banner";
import Relevancia from "../components/relevancia";
import styles from "../styles/page.module.css";

export default function HomeArranjos() {
  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState(null); // Estado de ordenação
  const produtosPorPagina = 12;
  const totalPagsVisiveis = 5;

  // Carregar produtos
  useEffect(() => {
    fetch("http://191.52.6.89:5000/listar_produtos")
      .then((res) => res.json())
      .then((data) => {
        const produtosFormatados = data
          .filter((produto) => produto[2]?.toLowerCase() === "arranjo")
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

  // Paginação
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

  // Ordenação
  let produtosOrdenados = [...produtosPagina];
  if (ordenacao === "preco-asc") {
    produtosOrdenados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
  } else if (ordenacao === "preco-desc") {
    produtosOrdenados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
  }

  return (
    <div>
      <Banner
        imagem="/imgs/flores2.jpeg"
        titulo="Arranjos e Buquês"
        texto="Encontre aqui buquês e arranjos frescos, cheios de cores e vida. Perfeitos para presentear ou decorar com charme natural."
      />

      <div className={styles.container}>
        {/* Filtros */}
        <div className={styles.containerFiltros}>
          <span className={styles.totalProdutos}>
            {produtos.length} produtos
          </span>
          <div className={styles.filtros}>
            <Relevancia onChange={(valor) => setOrdenacao(valor)} />
          </div>
        </div>

        {/* Grid de produtos */}
        <div className={styles.produtoGrid}>
          {produtosOrdenados.map((item) => (
            <Produto
              key={item.id}
              id={item.id}
              nome={item.nome}
              preco={item.preco}
              imagemPrincipal={item.imagemPrincipal}
            />
          ))}
        </div>

        {/* Paginação */}
        <div className={styles.paginacao}>
          <span className={styles.infoPaginacao}>
            Você está na página {paginaAtual}
          </span>
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
