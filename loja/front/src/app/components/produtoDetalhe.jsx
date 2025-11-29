"use client";
import React, { useState } from "react";
import styles from "../styles/produtoDetalhe.module.css";
import { useCarrinho } from "../context/carrinhoContext";

export default function ProdutoDetalhe({
  id,
  imagemPrincipal,
  imagemSecundaria,
  imagemTerciaria,
  nome,
  preco,
  descricao,
}) {
  const [imagemAtual, setImagemAtual] = useState(imagemPrincipal);
  const [adicionado, setAdicionado] = useState(false);

  const { adicionarItem } = useCarrinho();

  const handleTrocarImagem = (novaImagemSrc) => {
    setImagemAtual(novaImagemSrc);
  };

  const precoFormatado = Number(preco).toFixed(2).replace(".", ",");

  const handleAddToCart = () => {
    if (!id) {
      console.error("Produto sem ID não pode ser adicionado ao carrinho");
      return;
    }

    adicionarItem({
      id: id.toString(), // garante string
      nome,
      preco: Number(preco),
      quantidade: 1,
      imagem: imagemPrincipal,
    });

    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.colunaImagens}>
        <div className={styles.imagensMenores}>
          <img
            className={`${styles.imagemMenor} ${
              imagemAtual === imagemPrincipal ? styles.imagemMenorAtiva : ""
            }`}
            src={imagemPrincipal}
            alt={`${nome} - Foto 1`}
            onClick={() => handleTrocarImagem(imagemPrincipal)}
          />
          {imagemSecundaria && (
            <img
              className={`${styles.imagemMenor} ${
                imagemAtual === imagemSecundaria ? styles.imagemMenorAtiva : ""
              }`}
              src={imagemSecundaria}
              alt={`${nome} - Foto 2`}
              onClick={() => handleTrocarImagem(imagemSecundaria)}
            />
          )}
          {imagemTerciaria && (
            <img
              className={`${styles.imagemMenor} ${
                imagemAtual === imagemTerciaria ? styles.imagemMenorAtiva : ""
              }`}
              src={imagemTerciaria}
              alt={`${nome} - Foto 3`}
              onClick={() => handleTrocarImagem(imagemTerciaria)}
            />
          )}
        </div>

        <div className={styles.imagemPrincipalContainer}>
          <img
            className={styles.imagemPrincipal}
            src={imagemAtual}
            alt={nome}
          />
        </div>
      </div>

      <div className={styles.colunaInfo}>
        <h1 className={styles.nome}>{nome}</h1>
        <div className={styles.precoContainer}>
          <p className={styles.preco}>R$ {precoFormatado}</p>
          <span className={styles.aVista}>à vista</span>
        </div>

        <button onClick={handleAddToCart} className={styles.botaoSacola}>
          ADICIONAR À SACOLA
        </button>

        {adicionado && (
          <p className={styles.mensagemAdicionado}>
            Produto adicionado ao carrinho!
          </p>
        )}

        <p className={styles.opcoesEntregaTitle}>Opções de entrega</p>
        {/* ... restante do JSX ... */}
      </div>

      <div className={styles.descricaoCompleta}>
        <h3 className={styles.descricaoTitle}>Descrição do produto</h3>
        <p className={styles.descricaoText}>{descricao}</p>
      </div>
    </div>
  );
}
