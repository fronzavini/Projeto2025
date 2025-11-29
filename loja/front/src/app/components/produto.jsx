"use client";
import React from "react";
import Link from "next/link";
import styles from "../styles/produto.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

export default function Produto({
  id,
  imagemPrincipal,
  nome,
  preco,
  addToCart,
}) {
  return (
    <div className={styles.produto}>
      {/* LINK CORRETAMENTE ABERTO E FECHADO */}
      <Link href={`/produtoDetalhe/${id}`} className={styles.card}>
        <div className={styles.imagens}>
          <img className={styles.imagem} src={imagemPrincipal} alt={nome} />
        </div>
      </Link>

      <h2 className={styles.nome}>{nome}</h2>

      <div className={styles.alinhar}>
        <p className={styles.preco}>R$ {preco}</p>

        <button
          onClick={addToCart}
          className={styles.botao}
          aria-label="Adicionar à sacola"
        >
          <FontAwesomeIcon icon={faBagShopping} />
        </button>
      </div>
    </div>
  );
}
