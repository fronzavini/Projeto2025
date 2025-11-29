"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/produto.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

import { useCarrinho } from "../context/carrinhoContext";

export default function Produto({ id, imagemPrincipal, nome, preco }) {
  const { adicionarItem, dadosCheckout } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);

  const handleAddToCart = () => {
    // Checa se já existe no carrinho
    const itemExistente = dadosCheckout.itensPedido.find((i) => i.id === id);

    if (itemExistente) {
      // Já existe: apenas aumenta a quantidade
      adicionarItem({
        id,
        nome,
        preco: preco.toString().replace(",", "."),
        quantidade: 1,
        imagem: imagemPrincipal,
      });
    } else {
      // Novo item
      adicionarItem({
        id,
        nome,
        preco: preco.toString().replace(",", "."),
        quantidade: 1,
        imagem: imagemPrincipal,
      });
    }

    // Mensagem temporária
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  return (
    <div className={styles.produto}>
      <Link href={`/produtoDetalhe/${id}`} className={styles.card}>
        <div className={styles.imagens}>
          <img className={styles.imagem} src={imagemPrincipal} alt={nome} />
        </div>
      </Link>

      <h2 className={styles.nome}>{nome}</h2>

      <div className={styles.alinhar}>
        <p className={styles.preco}>R$ {preco}</p>

        <button
          onClick={handleAddToCart}
          className={styles.botao}
          aria-label="Adicionar à sacola"
        >
          <FontAwesomeIcon icon={faBagShopping} />
        </button>
      </div>

      {/* Mensagem de feedback */}
      {adicionado && (
        <p className={styles.mensagemAdicionado}>
          Produto adicionado ao carrinho!
        </p>
      )}
    </div>
  );
}
