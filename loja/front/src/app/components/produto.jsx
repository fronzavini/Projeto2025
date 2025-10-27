"use client";
import React from "react";
import styles from "../styles/produto.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

export default function Produto({ imagemPrincipal, nome, preco, addToCart }) {
  return (
    <div className={styles.produto}>
      <img className={styles.imagem} src={imagemPrincipal} alt={nome} />
      <h2 className={styles.nome}>{nome}</h2>
      <div className={styles.alinhar}>
        <p className={styles.preco}>R$ {preco}</p>
        <button onClick={addToCart} className={styles.botao}>
          <FontAwesomeIcon icon={faBagShopping} />
        </button>
      </div>
    </div>
  );
}
