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
      // Normalizar: aceitar vários formatos de retorno
      let transacoes = [];
      if (Array.isArray(resultado)) transacoes = resultado;
      else if (resultado && Array.isArray(resultado.detalhes))
        transacoes = resultado.detalhes;
      else if (resultado && Array.isArray(resultado.transacoes))
        transacoes = resultado.transacoes;
      else if (resultado && Array.isArray(resultado.data)) transacoes = resultado.data;
      else transacoes = [];

      let entradas = 0;
      let saidas = 0;

      for (const t of transacoes) {
        let tipo;
        let valorRaw;

        if (Array.isArray(t)) {
          // fallback: many endpoints return tuples. According to DB schema the order is:
          // [id, data_transacao, tipo, categoria, descricao, valor]
          tipo = t[2];
          valorRaw = t[5];
        } else if (t && typeof t === "object") {
          tipo = t.tipo ?? t[1] ?? t["tipo"];
          valorRaw = t.valor ?? t[4] ?? t["valor"] ?? Object.values(t).find(v => typeof v === 'number' || typeof v === 'string');
        } else {
          continue;
        }

        // garantir número: lidar com Decimal/number/string com ',' ou '.'
        const parseValor = (raw) => {
          if (raw === null || raw === undefined) return 0;
          if (typeof raw === 'number') return raw;
          let s = String(raw).trim();
          if (!s) return 0;
          // se contém vírgula, provavelmente formato BR: pontos milhares e vírgula decimal
          if (s.indexOf(',') !== -1) {
            // remover pontos (separador de milhares) e trocar vírgula por ponto decimal
            s = s.replace(/\./g, '').replace(/,/g, '.');
          }
          // caso não tenha vírgula, assumimos ponto decimal (ou somente dígitos)
          const n = Number(s);
          return Number.isFinite(n) ? n : 0;
        };

        const valor = parseValor(valorRaw);

        const tipoStr = (tipo || "").toString().toLowerCase();
        // aceitar 'entrada' e 'saida' (variações)
        if (tipoStr.includes("entr")) entradas += valor;
        else if (tipoStr.includes("sai")) saidas += valor;
      }

      const total = entradas - saidas;

      setTotais({ total, entradas, saidas });
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