"use client";

import React from "react";
import styles from "../styles/carrinho.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function ItemCarrinho({ produto, onQuantidadeChange }) {
  const precoFormatado = produto.preco.toFixed(2).replace(".", ",");
  const precoTotalFormatado = (produto.preco * produto.quantidade)
    .toFixed(2)
    .replace(".", ",");

  const handleAumentar = () => {
    onQuantidadeChange(produto.id, produto.quantidade + 1);
  };

  const handleDiminuir = () => {
    onQuantidadeChange(produto.id, produto.quantidade - 1);
  };

  return (
    <div className={styles.itemProduto}>
      <div className={styles.produtoHeader}>
        <img
          src={produto.imagem}
          alt={produto.nome}
          className={styles.imagemProduto}
        />
           
        <div className={styles.detalhesProduto}>
                    <p className={styles.nomeProduto}>{produto.nome}</p>       
                 
          <p className={styles.refProduto}>Ref: # {produto.referencia}</p>     
           
        </div>
         
        <button className={styles.botaoRemover} aria-label="Remover item">
                    <FontAwesomeIcon icon={faTrashCan} />         
        </button>
      </div>
      <div className={styles.produtoFooter}>
        <div className={styles.grupoQuantidade}>
           <label className={styles.labelQuantidade}>Quantidade:</label>       
           
          <div className={styles.controleQuantidade}>
            {/* Botão de Diminuir (-) */}
            <button
              className={styles.botaoMenos}
              onClick={handleDiminuir}
              disabled={produto.quantidade <= 1} // Importante para o efeito cinza
            >
              <span aria-hidden="true">−</span>{" "}
              {/* Use o caractere de traço real ou ícone */}
            </button>

            {/* Input de Quantidade */}
            <input
              type="number"
              value={produto.quantidade} // O número 1 na imagem
              readOnly // O valor só muda pelos botões
              className={styles.inputQuantidade}
            />

            {/* Botão de Aumentar (+) */}
            <button className={styles.botaoMais} onClick={handleAumentar}>
              <span aria-hidden="true">+</span>{" "}
              {/* Use o caractere de mais real ou ícone */}
            </button>
          </div>
               
        </div>
                <p className={styles.precoProduto}>R$ {precoTotalFormatado}</p> 
           
      </div>
       
      <a href="/flores" className={styles.linkExplorarMais}>
                Explorar mais produtos desta loja        
      </a>
    </div>
  );
}

export default ItemCarrinho;
