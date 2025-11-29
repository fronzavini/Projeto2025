"use client";

import React from "react";
import styles from "../styles/carrinho.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useCarrinho } from "../context/carrinhoContext";

export default function ItemCarrinho({ produto }) {
  const { removerItem, atualizarQuantidade } = useCarrinho();

  // Calcula o total do item formatado
  const precoTotalFormatado = (produto.preco * produto.quantidade)
    .toFixed(2)
    .replace(".", ",");

  // Aumentar quantidade
  const handleAumentar = () => {
    atualizarQuantidade(produto.id, produto.quantidade + 1);
  };

  // Diminuir quantidade
  const handleDiminuir = () => {
    if (produto.quantidade > 1) {
      atualizarQuantidade(produto.id, produto.quantidade - 1);
    }
  };

  // Remover item do carrinho
  const handleRemover = () => {
    removerItem(produto.id);
  };

  return (
    <div className={styles.itemProduto}>
      {/* Cabeçalho do produto */}
      <div className={styles.produtoHeader}>
        <img
          src={produto.imagem}
          alt={produto.nome}
          className={styles.imagemProduto}
        />

        <div className={styles.detalhesProduto}>
          <p className={styles.nomeProduto}>{produto.nome}</p>
          <p className={styles.refProduto}>Ref: # {produto.id}</p>
        </div>

        <button
          className={styles.botaoRemover}
          aria-label="Remover item"
          onClick={handleRemover}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>

      {/* Rodapé do produto */}
      <div className={styles.produtoFooter}>
        <div className={styles.grupoQuantidade}>
          <label className={styles.labelQuantidade}>Quantidade:</label>
          <div className={styles.controleQuantidade}>
            <button
              className={styles.botaoMenos}
              onClick={handleDiminuir}
              disabled={produto.quantidade <= 1}
            >
              −
            </button>
            <input
              type="number"
              value={produto.quantidade}
              readOnly
              className={styles.inputQuantidade}
            />
            <button className={styles.botaoMais} onClick={handleAumentar}>
              +
            </button>
          </div>
        </div>

        <p className={styles.precoProduto}>R$ {precoTotalFormatado}</p>
      </div>

      {/* Link para explorar mais produtos */}
      <a href="/flores" className={styles.linkExplorarMais}>
        Explorar mais produtos desta loja
      </a>
    </div>
  );
}
