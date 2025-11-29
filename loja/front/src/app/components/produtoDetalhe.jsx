"use client";
import React, { useState } from "react";
import styles from "../styles/produtoDetalhe.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProdutoDetalhe({
  imagemPrincipal,
  imagemSecundaria,
  imagemTerciaria,
  nome,
  preco,
  addToCart,
  descricao,
}) {
  const [imagemAtual, setImagemAtual] = useState(imagemPrincipal);

  const handleTrocarImagem = (novaImagemSrc) => {
    setImagemAtual(novaImagemSrc);
  };

  const precoFormatado = preco.toFixed(2).replace(".", ",");

  return (
    <div className={styles.container}>
      {/* --------------------- COLUNA ESQUERDA: IMAGENS --------------------- */}
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
          <img
            className={`${styles.imagemMenor} ${
              imagemAtual === imagemSecundaria ? styles.imagemMenorAtiva : ""
            }`}
            src={imagemSecundaria}
            alt={`${nome} - Foto 2`}
            onClick={() => handleTrocarImagem(imagemSecundaria)}
          />
          <img
            className={`${styles.imagemMenor} ${
              imagemAtual === imagemTerciaria ? styles.imagemMenorAtiva : ""
            }`}
            src={imagemTerciaria}
            alt={`${nome} - Foto 3`}
            onClick={() => handleTrocarImagem(imagemTerciaria)}
          />
        </div>

        <div className={styles.imagemPrincipalContainer}>
          <img
            className={styles.imagemPrincipal}
            src={imagemAtual}
            alt={nome}
          />
          {/* Botão de "Encontrar similares" removido */}
        </div>
      </div>

      {/* --------------------- COLUNA DIREITA: INFORMAÇÕES --------------------- */}
      <div className={styles.colunaInfo}>
        <h1 className={styles.nome}>{nome}</h1>
        <div className={styles.precoContainer}>
          <p className={styles.preco}>R$ {precoFormatado}</p>
          <span className={styles.aVista}>à vista</span>
        </div>
        <button onClick={addToCart} className={styles.botaoSacola}>
          ADICIONAR À SACOLA
        </button>

        <p className={styles.opcoesEntregaTitle}>Opções de entrega</p>

        <div className={styles.opcaoEntrega}>
          <div className={styles.entregaHeader}>
            <span className={styles.entregaTitle}>Retire na Loja</span>
            <span className={styles.entregaDetalhe}>Em até 3 horas.</span>
          </div>
        </div>

        <div className={styles.opcaoEntrega}>
          <span className={styles.entregaTitle}>Receba em casa</span>
          <p className={styles.entregaDescricao}>
            Informe seu CEP para consultar os prazos de entrega no seu endereço.
          </p>

          <form className={styles.formCep}>
            <input
              type="text"
              placeholder="00000-000"
              className={styles.inputCep}
              maxLength="9"
            />
            <button type="submit" className={styles.botaoCep}>
              CALCULAR
            </button>
          </form>

          <span className={styles.naoSabeCep}>Não sabe seu CEP?</span>
        </div>
      </div>

      <div className={styles.descricaoCompleta}>
        <h3 className={styles.descricaoTitle}>Descrição do produto</h3>
        <p className={styles.descricaoText}>{descricao}</p>
      </div>
    </div>
  );
}
