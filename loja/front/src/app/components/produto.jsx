"use client";
import React from "react";
import styles from "../styles/produto.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

export default function Produto({ imagemPrincipal, imagemSecundaria, imagemTerciaria, nome, preco, addToCart }) {
  return (
    <div className={styles.produto}>
      <div className={styles.imagens}>
        <img className={styles.imagemMenor} src={imagemSecundaria} alt={nome} />
        <img className={styles.imagemMenor} src={imagemTerciaria} alt={nome} />
        <img className={styles.imagem} src={imagemPrincipal} alt={nome} />
      </div>
      <h2 className={styles.nome}>{nome}</h2>
      <div className={styles.alinhar}>
        <p className={styles.preco}>R$ {preco}</p>
        <hr/>
        <button onClick={addToCart} className={styles.botao}>
          <FontAwesomeIcon icon={faBagShopping} />
        </button>
      </div>
    </div>
  );
}
