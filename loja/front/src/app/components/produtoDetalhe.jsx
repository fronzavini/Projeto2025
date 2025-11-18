"use client";
import React, { useState } from "react";
import styles from "../styles/produtoDetalhe.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function ProdutoDetalhe({
  imagemPrincipal,
  imagemSecundaria,
  imagemTerciaria,
  nome,
  preco,
  addToCart,
  descricao,
}) {
  // Estado para rastrear qual imagem deve ser exibida como principal
  const [imagemAtual, setImagemAtual] = useState(imagemPrincipal);

  // Função para mudar a imagem principal
  const handleTrocarImagem = (novaImagemSrc) => {
    setImagemAtual(novaImagemSrc);
  };

  // Use um separador de milhares e vírgula para centavos para o preço em BRL
  const precoFormatado = preco.toFixed(2).replace(".", ",");

  return (
    // Container principal que usa Flexbox para alinhar Imagens (esquerda) e Info (direita)
    <div className={styles.container}>
      {/* --------------------- COLUNA ESQUERDA: IMAGENS --------------------- */}
      <div className={styles.colunaImagens}>
        {/* Container das 3 miniaturas clicáveis */}
        <div className={styles.imagensMenores}>
          {/* 1. Imagem Principal como Thumbnail (Fica em cima) */}
          <img
            // Adiciona a classe 'imagemMenorAtiva' se for a imagem sendo exibida
            className={`${styles.imagemMenor} ${
              imagemAtual === imagemPrincipal ? styles.imagemMenorAtiva : ""
            }`}
            src={imagemPrincipal}
            alt={`${nome} - Foto 1`}
            onClick={() => handleTrocarImagem(imagemPrincipal)}
          />

          {/* 2. Imagem Secundária */}
          <img
            // Adiciona a classe 'imagemMenorAtiva' se for a imagem sendo exibida
            className={`${styles.imagemMenor} ${
              imagemAtual === imagemSecundaria ? styles.imagemMenorAtiva : ""
            }`}
            src={imagemSecundaria}
            alt={`${nome} - Foto 2`}
            onClick={() => handleTrocarImagem(imagemSecundaria)}
          />

          {/* 3. Imagem Terciária */}
          <img
            // Adiciona a classe 'imagemMenorAtiva' se for a imagem sendo exibida
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
            // A imagem principal agora usa o estado `imagemAtual`
            src={imagemAtual}
            alt={nome}
          />
          <button className={styles.botaoSimilares}>
            <FontAwesomeIcon icon={faSearch} className={styles.pesquisa} />{" "}
            Encontrar similares
          </button>
        </div>
      </div>

      {/* --------------------- COLUNA DIREITA: INFORMAÇÕES --------------------- */}
      <div className={styles.colunaInfo}>
        {/* Nome do Produto */}
        <h1 className={styles.nome}>{nome}</h1>

        {/* Preço e "à vista" */}
        <div className={styles.precoContainer}>
          <p className={styles.preco}>R$ {precoFormatado}</p>
          <span className={styles.aVista}>à vista</span>
        </div>

        {/* Botão ADICIONAR À SACOLA */}
        <button onClick={addToCart} className={styles.botaoSacola}>
          ADICIONAR À SACOLA
        </button>

        {/* ------------------ Opções de Entrega ------------------ */}
        <p className={styles.opcoesEntregaTitle}>Opções de entrega</p>

        {/* Retire na Loja */}
        <div className={styles.opcaoEntrega}>
          <div className={styles.entregaHeader}>
            <span className={styles.entregaTitle}>Retire na Loja</span>
            <span className={styles.entregaDetalhe}>Em até 3 horas.</span>
          </div>
        </div>

        {/* Receba em Casa */}
        <div className={styles.opcaoEntrega}>
          <span className={styles.entregaTitle}>Receba em casa</span>
          <p className={styles.entregaDescricao}>
            Informe seu CEP para consultar os prazos de entrega no seu endereço.
          </p>

          <form className={styles.formCep}>
            <input
              type="text"
              placeholder="00000-000" // Placeholder como na imagem
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

      {/* --------------------- DESCRIÇÃO DO PRODUTO (Abaixo) --------------------- */}
      <div className={styles.descricaoCompleta}>
        <h3 className={styles.descricaoTitle}>Descrição do produto</h3>
        <p className={styles.descricaoText}>{descricao}</p>
      </div>
    </div>
  );
}
