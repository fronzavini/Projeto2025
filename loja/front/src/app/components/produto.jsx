"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/produto.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { addItem } from "../lib/cartApi"; // usa helper que normaliza o preço

export default function Produto({ id, imagemPrincipal, nome, preco }) {
  const [adicionado, setAdicionado] = useState(false);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setErro(null);
    try {
      const userData =
        typeof window !== "undefined"
          ? localStorage.getItem("usuario_loja")
          : null;

      const idUsuario =
        (userData && JSON.parse(userData)?.id) ||
        (typeof window !== "undefined"
          ? Number(localStorage.getItem("idUsuario"))
          : null);

      if (!idUsuario) {
        setErro("Você precisa estar logado para adicionar ao carrinho.");
        return;
      }

      setLoading(true);

      // ✅ Envie o preco como veio (string "0,50", "0.50" ou number 0.5).
      // O addItem() já normaliza para reais corretamente.
      const resposta = await addItem(idUsuario, {
        produtoId: Number(id),
        quantidade: 1,
        preco, // <-- sem toNumberBR aqui!
      });

      const rawMsg = (resposta?.message || resposta?.erro || "")
        .toString()
        .toLowerCase();
      if (!resposta || rawMsg.includes("erro")) {
        setErro("Não foi possível adicionar o produto. Tente novamente.");
        return;
      }

      setAdicionado(true);
      setTimeout(() => setAdicionado(false), 2000);
    } catch (e) {
      console.error("Erro ao adicionar ao carrinho:", e);
      setErro("Erro ao adicionar ao carrinho. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          title={loading ? "Adicionando..." : "Adicionar à sacola"}
        >
          <FontAwesomeIcon icon={faBagShopping} />
        </button>
      </div>

      {adicionado && (
        <p className={styles.mensagemAdicionado}>
          Produto adicionado ao carrinho!
        </p>
      )}

      {erro && <p className={styles.mensagemErro}>{erro}</p>}
    </div>
  );
}
