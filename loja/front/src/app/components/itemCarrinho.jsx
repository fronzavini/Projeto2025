// src/components/ItemCarrinho.jsx
"use client";
import React, { useMemo, useState } from "react";
import styles from "../styles/carrinho.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { updateItem, removeItem } from "../lib/cartApi";

export default function ItemCarrinho({ produto, onChanged }) {
  const [qtd, setQtd] = useState(Number(produto.quantidade || 1));
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const precoUnit = Number(produto.preco || 0);
  const totalItem = useMemo(
    () => (precoUnit * qtd).toFixed(2).replace(".", ","),
    [precoUnit, qtd]
  );

  const getUserId = () => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("usuario_loja")
          : null;
      const obj = raw ? JSON.parse(raw) : null;
      return (
        obj?.id ||
        (typeof window !== "undefined"
          ? Number(localStorage.getItem("idUsuario"))
          : null)
      );
    } catch {
      return null;
    }
  };

  const refresh = () => {
    if (onChanged) return onChanged(); // pai decide como atualizar
    if (typeof window !== "undefined") window.location.reload(); // fallback
  };

  async function alterarQuantidade(novaQtd) {
    if (novaQtd < 1 || novaQtd === qtd) return;
    const userId = getUserId();
    if (!userId)
      return setErro("Você precisa estar logado para alterar o carrinho.");
    try {
      setLoading(true);
      setErro(null);
      setQtd(novaQtd); // otimista
      await updateItem(userId, {
        produtoId: Number(produto.id),
        quantidade: Number(novaQtd),
      });
      refresh();
    } catch (e) {
      console.error(e);
      setQtd(qtd); // rollback
      setErro("Não foi possível atualizar a quantidade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function remover() {
    const userId = getUserId();
    if (!userId)
      return setErro("Você precisa estar logado para alterar o carrinho.");
    try {
      setLoading(true);
      setErro(null);
      await removeItem(userId, Number(produto.id));
      refresh();
    } catch (e) {
      console.error(e);
      setErro("Não foi possível remover o item. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

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
          <p className={styles.refProduto}>Ref: # {produto.id}</p>
        </div>
        <button
          className={styles.botaoRemover}
          aria-label="Remover item"
          onClick={remover}
          disabled={loading}
          title={loading ? "Removendo..." : "Remover"}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>

      <div className={styles.produtoFooter}>
        <div className={styles.grupoQuantidade}>
          <label className={styles.labelQuantidade}>Quantidade:</label>
          <div className={styles.controleQuantidade}>
            <button
              className={styles.botaoMenos}
              onClick={() => alterarQuantidade(qtd - 1)}
              disabled={qtd <= 1 || loading}
              title={loading ? "Atualizando..." : "Diminuir"}
            >
              −
            </button>
            <input
              type="number"
              value={qtd}
              readOnly
              className={styles.inputQuantidade}
            />
            <button
              className={styles.botaoMais}
              onClick={() => alterarQuantidade(qtd + 1)}
              disabled={loading}
              title={loading ? "Atualizando..." : "Aumentar"}
            >
              +
            </button>
          </div>
        </div>

        <p className={styles.precoProduto}>R$ {totalItem}</p>
      </div>

      {erro && <p className={styles.mensagemErro}>{erro}</p>}
      <a href="/flores" className={styles.linkExplorarMais}>
        Explorar mais produtos desta loja
      </a>
    </div>
  );
}
