"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/carrinho.module.css";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

export default function ResumoCompra() {
  const [dadosCheckout, setDadosCheckout] = useState({
    valoresTotais: { subtotal: 0, total: 0, frete: "Grátis" },
    itensPedido: [],
  });

  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [aplicando, setAplicando] = useState(false);
  const [erroCupom, setErroCupom] = useState(null);
  const [okCupom, setOkCupom] = useState(null);

  const formatCurrency = (value) =>
    Number(value || 0)
      .toFixed(2)
      .replace(".", ",");

  const parseFreteToNumber = (frete) => {
    if (typeof frete === "string" && frete.toLowerCase().includes("gr"))
      return 0;
    const n = Number(frete);
    return Number.isFinite(n) ? n : 0;
  };

  const numItens = dadosCheckout.itensPedido.length;

  // Carrega o carrinho
  useEffect(() => {
    (async () => {
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

        if (!idUsuario) return;

        const res = await fetch(
          `${BACKEND_URL}/carrinho/usuario/${idUsuario}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;

        const carrinho = await res.json();
        const subtotal = Number(carrinho?.valorTotal || 0);
        const frete = "Grátis";
        const freteNum = parseFreteToNumber(frete);

        const itensPedido = (carrinho?.produtos || []).map((p) => ({
          id: p.produto_id,
          quantidade: Number(p.quantidade || 0),
          preco: Number(p.preco_unitario || 0),
          nome: `Produto #${p.produto_id}`,
        }));

        setDadosCheckout({
          valoresTotais: {
            subtotal,
            total: Math.max(0.01, subtotal + freteNum),
            frete,
          },
          itensPedido,
        });
        setDesconto(0);
        setErroCupom(null);
        setOkCupom(null);
      } catch (e) {
        console.error("Erro ao carregar resumo do carrinho:", e);
      }
    })();
  }, []);

  function decidirTipoCupom(data, codigoUpper) {
    const t = (
      data?.tipo ||
      data?.tipo_cupom ||
      data?.desconto_tipo ||
      data?.kind ||
      ""
    )
      .toString()
      .toLowerCase();

    if (t === "fixo" || t === "percentual") return t;

    const pct = Number(
      data?.percentual || data?.desconto_percentual || data?.porcentagem || 0
    );
    const val = Number(
      data?.valor_desconto ??
        data?.desconto ??
        data?.valor ??
        data?.desconto_fixo ??
        0
    );

    if (pct > 0) return "percentual";
    if (val > 0) return "fixo";

    // fallback por código conhecido
    if (codigoUpper === "BLACK") return "fixo";

    return ""; // desconhecido
  }

  const handleAplicarCupom = async () => {
    setErroCupom(null);
    setOkCupom(null);

    const subtotalAtual = Number(dadosCheckout.valoresTotais.subtotal || 0);
    const freteNum = parseFreteToNumber(dadosCheckout.valoresTotais.frete);
    const codigoUpper = cupom.trim().toUpperCase();

    if (!codigoUpper) {
      setErroCupom("Informe um cupom.");
      return;
    }
    if (subtotalAtual <= 0) {
      setErroCupom("Subtotal inválido para aplicar cupom.");
      return;
    }

    try {
      setAplicando(true);
      const resp = await fetch(`${BACKEND_URL}/calcular_desconto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor_total: subtotalAtual,
          codigo_cupom: codigoUpper,
        }),
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok || !data || data.resultado !== "ok") {
        const msg =
          data?.detalhes || data?.erro || "Cupom inválido ou expirado.";
        setErroCupom(msg);
        return;
      }

      // --- Diferenciação fixo x percentual ---
      const tipo = decidirTipoCupom(data, codigoUpper);

      const pct = Number(
        data?.percentual || data?.desconto_percentual || data?.porcentagem || 0
      );
      const val = Number(
        data?.valor_desconto ??
          data?.desconto ??
          data?.valor ??
          data?.desconto_fixo ??
          0
      );

      let descAbs = 0;

      if (tipo === "percentual") {
        const fator = pct > 0 ? pct / 100 : 0;
        if (!fator) {
          setErroCupom(
            "Cupom percentual sem percentual informado pelo backend."
          );
          return;
        }
        descAbs = subtotalAtual * fator;
      } else if (tipo === "fixo") {
        if (!val) {
          // Ex: BLACK fixo sem valor retornado
          setErroCupom("Cupom fixo sem valor informado pelo backend.");
          return;
        }
        descAbs = val;
      } else {
        // Tipo desconhecido → tenta heurística (prioriza percent, depois fixo)
        if (pct > 0) {
          descAbs = subtotalAtual * (pct / 100);
        } else if (val > 0) {
          descAbs = val;
        } else {
          setErroCupom("Não foi possível calcular o desconto deste cupom.");
          return;
        }
      }

      // Candidato do backend
      const backendTotal = Number(data?.valor_final);

      // Usa backendTotal só se for < subtotal (ou seja, aplicou desconto)
      let totalCalc =
        Number.isFinite(backendTotal) && backendTotal < subtotalAtual
          ? backendTotal
          : subtotalAtual - descAbs;

      // soma frete e aplica mínimo (nunca 0 ou negativo)
      totalCalc = Math.max(0.01, totalCalc + freteNum);

      // limita o desconto para não passar o subtotal
      const descontoAplicado = Math.min(descAbs, subtotalAtual);

      setDesconto(descontoAplicado);
      setDadosCheckout((prev) => ({
        ...prev,
        valoresTotais: {
          ...prev.valoresTotais,
          total: totalCalc,
        },
      }));
      setOkCupom(`Cupom aplicado: ${codigoUpper}`);
      setCupom("");
    } catch (e) {
      console.error(e);
      setErroCupom("Erro ao aplicar o cupom. Tente novamente.");
    } finally {
      setAplicando(false);
    }
  };

  return (
    <div className={styles.resumoCompraContainer}>
      <h2 className={styles.tituloSecao}>Resumo da compra</h2>

      {/* Subtotal */}
      <div className={styles.linhaResumo}>
        <span>
          Subtotal ({numItens} item{numItens > 1 ? "s" : ""})
        </span>
        <span className={styles.valorSubtotal}>
          R$ {formatCurrency(dadosCheckout.valoresTotais.subtotal)}
        </span>
      </div>

      {/* Frete */}
      <div className={styles.linhaFrete}>
        <div className={styles.freteDetalhes}>
          <span>Frete</span>
          <p className={styles.prazoEntrega}>
            Chega dia <strong>23 de Dezembro</strong>
          </p>
        </div>
        <span className={styles.valorFrete}>
          {dadosCheckout.valoresTotais.frete}
        </span>
      </div>

      {/* Cupom */}
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
          <button
            onClick={handleAplicarCupom}
            className={styles.botaoAplicar}
            disabled={aplicando}
          >
            {aplicando ? "Aplicando..." : "Aplicar"}
          </button>
        </div>

        {erroCupom && (
          <p className={styles.mensagemErro} style={{ marginTop: 8 }}>
            {erroCupom}
          </p>
        )}
        {okCupom && (
          <p className={styles.mensagemAdicionado} style={{ marginTop: 8 }}>
            {okCupom}
          </p>
        )}
      </div>

      {/* Desconto */}
      <div className={styles.linhaResumo}>
        <span>Desconto</span>
        <span className={styles.valorSubtotal}>
          - R$ {formatCurrency(desconto)}
        </span>
      </div>

      <div className={styles.divisorTotal}></div>

      {/* Total final */}
      <div className={`${styles.linhaResumo} ${styles.valorTotal}`}>
        <span>Valor total</span>
        <span className={styles.valorFinal}>
          R$ {formatCurrency(dadosCheckout.valoresTotais.total)}
        </span>
      </div>

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
