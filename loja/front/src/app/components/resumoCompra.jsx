"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/carrinho.module.css";
import { useCarrinho } from "../context/carrinhoContext"; // <<-- NOVO: Importa o hook

// REMOVIDA A PROP { dadosResumo }
function ResumoCompra() {
  // PEGA OS DADOS DO ESTADO GLOBAL
  const { dadosCheckout } = useCarrinho();
  const { valoresTotais, itensPedido } = dadosCheckout;

  const [cupom, setCupom] = useState("");

  // Garante que o valor seja formatado
  const formatCurrency = (value) =>
    value?.toFixed(2).replace(".", ",") || "0,00";

  // Usamos o número real de itens do Contexto
  const numItens = itensPedido.length;

  // Função fictícia para aplicar cupom
  const handleAplicarCupom = () => {
    // Em um app real, isso atualizaria o estado global via atualizarDadosCheckout
    alert(`Cupom aplicado: ${cupom}`);
    setCupom("");
  };

  return (
    <div className={styles.resumoCompraContainer}>
      <h2 className={styles.tituloSecao}>Resumo da compra</h2>

      <div className={styles.linhaResumo}>
        <span>
          Subtotal ({numItens} item{numItens > 1 ? "s" : ""})
        </span>
        <span className={styles.valorSubtotal}>
          {/* Usamos o valor numérico para formatação */}
          R$ {formatCurrency(valoresTotais.subtotal)}
        </span>
      </div>

      <div className={styles.linhaFrete}>
        <div className={styles.freteDetalhes}>
          <span>Frete</span>
          <p className={styles.prazoEntrega}>
            Chega dia <strong>23 de Dezembro</strong>
          </p>
        </div>
        <span className={styles.valorFrete}>{valoresTotais.frete}</span>
      </div>

      {/* Cupom direto com input */}
      <div className={styles.linhaCupom}>
        <label className={styles.cupomLabel}>Cupom de desconto</label>
        <div className={styles.cupomInputGrupo}>
          <input
            type="text"
            placeholder="Digite seu cupom"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
            className={styles.inputCupom}
          />
          <button onClick={handleAplicarCupom} className={styles.botaoAplicar}>
            Aplicar
          </button>
        </div>
      </div>

      <div className={styles.divisorTotal}></div>

      <div className={`${styles.linhaResumo} ${styles.valorTotal}`}>
        <span>Valor total</span>
        <span className={styles.valorFinal}>
          R$ {formatCurrency(valoresTotais.total)}
        </span>
      </div>

      {/* O Link apenas navega, pois os dados já estão no Contexto */}
      <Link href="/checkout">
        <button className={styles.botaoFinalizar}>Próxima etapa</button>
      </Link>
      <Link href="/flores">
        <button className={styles.botaoEscolherMais}>
          Escolher mais produtos
        </button>
      </Link>
    </div>
  );
}

export default ResumoCompra;
