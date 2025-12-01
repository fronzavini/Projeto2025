"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/carrinho.module.css";

// Usa .env NEXT_PUBLIC_BACKEND_URL se existir
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

function ResumoCompra() {
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

  const numItens = dadosCheckout.itensPedido.length;

  // Carrega carrinho do usuário no backend
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

        const itensPedido = (carrinho?.produtos || []).map((p) => ({
          id: p.produto_id,
          quantidade: Number(p.quantidade || 0),
          preco: Number(p.preco_unitario || 0),
          nome: `Produto #${p.produto_id}`,
        }));

        setDadosCheckout({
          valoresTotais: { subtotal, total: subtotal, frete: "Grátis" },
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

  const handleAplicarCupom = async () => {
    setErroCupom(null);
    setOkCupom(null);

    const subtotalAtual = Number(dadosCheckout.valoresTotais.subtotal || 0);
    if (!cupom) {
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
          codigo_cupom: cupom.trim(),
        }),
      });

      // backend responde JSON sempre
      const data = await resp.json().catch(() => null);

      if (!resp.ok || !data || data.resultado !== "ok") {
        const msg =
          data?.detalhes ||
          data?.erro ||
          "Não foi possível aplicar o cupom. Tente novamente.";
        setErroCupom(msg);
        return;
      }

      const novoDesconto = Number(data.desconto || 0);
      const novoTotal = Number(data.valor_final || subtotalAtual);

      setDesconto(novoDesconto);
      setDadosCheckout((prev) => ({
        ...prev,
        valoresTotais: {
          ...prev.valoresTotais,
          total: novoTotal,
        },
      }));
      setOkCupom(`Cupom aplicado: ${cupom.toUpperCase()}`);
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

      <div className={styles.linhaResumo}>
        <span>
          Subtotal ({numItens} item{numItens > 1 ? "s" : ""})
        </span>
        <span className={styles.valorSubtotal}>
          R$ {formatCurrency(dadosCheckout.valoresTotais.subtotal)}
        </span>
      </div>

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
            title={aplicando ? "Aplicando..." : "Aplicar cupom"}
          >
            {aplicando ? "Aplicando..." : "Aplicar"}
          </button>
        </div>

        {/* feedback do cupom */}
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

      {/* mostra a linha de desconto quando houver */}
      {desconto > 0 && (
        <div className={styles.linhaResumo}>
          <span>Desconto</span>
          <span className={styles.valorSubtotal}>
            - R$ {formatCurrency(desconto)}
          </span>
        </div>
      )}

      <div className={styles.divisorTotal}></div>

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

export default ResumoCompra;
