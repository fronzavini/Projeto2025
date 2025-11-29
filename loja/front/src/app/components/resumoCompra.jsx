"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/carrinho.module.css";

function ResumoCompra({ dadosResumo }) {
  const [cupom, setCupom] = useState("");

  const formatCurrency = (value) => value.toFixed(2).replace(".", ",");

  const numItens = 1; // ou calcular dinamicamente se quiser

  const handleAplicarCupom = () => {
    alert(`Cupom aplicado: ${cupom}`);
    setCupom("");
  };

  return (
    <div className={styles.resumoCompraContainer}>
      <h2 className={styles.tituloSecao}>Resumo da compra</h2>

      <div className={styles.linhaResumo}>
        <span>Subtotal ({numItens} item)</span>
        <span className={styles.valorSubtotal}>
          R$ {formatCurrency(dadosResumo.subtotal)}
        </span>
      </div>

      <div className={styles.linhaFrete}>
        <div className={styles.freteDetalhes}>
          <span>Frete</span>
          <p className={styles.prazoEntrega}>
            Chega dia <strong>23 de Dezembro</strong>
          </p>
        </div>
        <span className={styles.valorFrete}>Grátis</span>
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
          R$ {formatCurrency(dadosResumo.total)}
        </span>
      </div>

      <button className={styles.botaoFinalizar}>Próxima etapa</button>
      <Link href="/flores">
        <button className={styles.botaoEscolherMais}>
          Escolher mais produtos
        </button>
      </Link>
    </div>
  );
}

export default ResumoCompra;
