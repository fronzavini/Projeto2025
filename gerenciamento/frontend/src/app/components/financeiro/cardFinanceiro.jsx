"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/cardFinanceiro.module.css";

export default function CardFinanceiro() {
  const [totais, setTotais] = useState({
    total: 0,
    entradas: 0,
    saidas: 0,
  });

  useEffect(() => {
    carregarTotais();
  }, []);

  const carregarTotais = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/listar_transacaofinanceira"
      );
      if (!res.ok) throw new Error("Erro ao carregar transações");

      const resultado = await res.json();
      const transacoes = resultado || [];

      let entradas = 0;
      let saidas = 0;

      transacoes.forEach((t) => {
        const valor = parseFloat(t[4]) || 0;
        if (t[1] === "entrada") {
          entradas += valor;
        } else if (t[1] === "saida") {
          saidas += valor;
        }
      });

      const total = entradas - saidas;

      setTotais({
        total: Math.abs(total),
        entradas,
        saidas,
      });
    } catch (err) {
      console.error("Erro ao carregar totais:", err);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div>
      <div className={styles.resumo}>
        <div className={styles.card}>
          <div className={styles.icone}>
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className={styles.texto}>
            <span className={styles.descricao}>Total</span>
            <span className={styles.valor}>{formatarMoeda(totais.total)}</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icone}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className={styles.texto}>
            <span className={styles.descricao}>Entradas</span>
            <span className={styles.valor}>
              {formatarMoeda(totais.entradas)}
            </span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icone}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </div>
          <div className={styles.texto}>
            <span className={styles.descricao}>Saídas</span>
            <span className={styles.valor}>{formatarMoeda(totais.saidas)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}