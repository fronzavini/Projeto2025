// src/components/DetalhesPedido.js
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTruck, FaBoxOpen } from "react-icons/fa";
import styles from "../styles/detalhesPedido.module.css";

const BACKEND_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://192.168.18.155:5000";

/* =======================
 * Helpers
 * ======================= */
function formatCurrency(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(n);
}

function fmtDate(d) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("pt-BR");
  } catch {
    return String(d);
  }
}

function mapFormaPagamento(fp) {
  if (!fp) return "—";
  const s = String(fp).toLowerCase();
  if (s.includes("pix")) return "Pix";
  if (s.includes("dinheiro")) return "Dinheiro";
  return fp[0].toUpperCase() + fp.slice(1);
}

/* =======================
 * Timeline
 * ======================= */
const Timeline = ({ timeline }) => {
  const getIcon = (step) => {
    if (step === "Em transporte") return FaTruck;
    if (step === "Pedido entregue") return FaBoxOpen;
    return FaCheckCircle;
  };

  const getProgressWidth = (timeline) => {
    const completedSteps = timeline.filter((item) => item.completed).length;
    const totalSteps = timeline.length;
    if (completedSteps === 0) return 0;
    if (completedSteps === totalSteps) return 100;
    return ((completedSteps - 1) / (totalSteps - 1)) * 100;
  };

  const progressWidth = getProgressWidth(timeline);

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>

      <div className={styles.timelineSteps}>
        {timeline.map((item, index) => {
          const IconComponent = getIcon(item.etapa);
          const isLast = index === timeline.length - 1;

          return (
            <div
              key={index}
              className={`${styles.timelineItem} ${
                item.completed ? styles.completed : ""
              }`}
            >
              <div className={styles.timelineIconWrapper}>
                <IconComponent className={styles.timelineIcon} />
                {!isLast && (
                  <div
                    className={`${styles.timelineConnector} ${
                      item.completed
                        ? styles.completed
                        : styles.inactiveConnector
                    }`}
                  ></div>
                )}
              </div>

              <p className={styles.timelineLabel}>{item.etapa}</p>

              {item.data && (
                <p className={styles.timelineDate}>
                  {item.data} {item.hora && `| ${item.hora}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =======================
 * DetalhesPedido
 * ======================= */
export default function DetalhesPedido({
  pedido: pedidoProp,
  pedidoId: pedidoIdProp,
}) {
  const search = useSearchParams();
  const pedidoIdQuery = search?.get("id");
  const pedidoId = useMemo(
    () => Number(pedidoIdProp || pedidoIdQuery || 0) || null,
    [pedidoIdProp, pedidoIdQuery]
  );

  const [pedido, setPedido] = useState(pedidoProp || null);
  const [loading, setLoading] = useState(!pedidoProp && !!pedidoId);
  const [erro, setErro] = useState(null);

  // Busca pedido do backend quando não vem por props
  useEffect(() => {
    if (pedidoProp) return; // já temos via props
    if (!pedidoId) return;
    (async () => {
      try {
        setErro(null);
        setLoading(true);
        const r = await fetch(`${BACKEND_URL}/pedidos/${pedidoId}`, {
          cache: "no-store",
        });
        const data = await r.json().catch(() => null);
        if (!r.ok || !data || data.resultado === "erro") {
          setErro(data?.detalhes || "Não foi possível carregar o pedido.");
          setPedido(null);
          return;
        }
        setPedido(data);
      } catch (e) {
        console.error(e);
        setErro("Falha ao carregar o pedido.");
      } finally {
        setLoading(false);
      }
    })();
  }, [pedidoId, pedidoProp]);

  // Constrói os dados de tela a partir do shape do backend
  const view = useMemo(() => {
    if (!pedido) return null;

    // Campos do backend:
    // pedido: {
    //   id, cliente_id, funcionario_id, data_pedido, forma_pagamento, estado, canal,
    //   valor_total, tipo_entrega, data_entrega, entrega_*,
    //   mp_payment_id, mp_status,
    //   pago (vendas), dataVenda (vendas), produtos (JSON da vendas), valorTotal (vendas)
    // }
    let itens = [];
    try {
      const arr =
        typeof pedido.produtos === "string"
          ? JSON.parse(pedido.produtos || "[]")
          : Array.isArray(pedido.produtos)
          ? pedido.produtos
          : [];
      itens = arr.map((it) => ({
        id: Number(it.id),
        nome: `Produto #${it.id}`,
        quantidade: Number(it.quantidade || it.qtd || 1),
        valorUnitario: Number(it.preco || 0),
      }));
    } catch {
      itens = [];
    }

    const subtotal = itens.reduce(
      (acc, it) => acc + it.quantidade * it.valorUnitario,
      0
    );

    // Frete e descontos — se não existirem no banco, mantenha simples
    const totalVenda = Number(
      pedido.valorTotal || pedido.valor_total || subtotal
    );
    const frete = 0;
    const descontos = Math.max(0, subtotal - totalVenda); // heurística simples

    // Endereço de entrega
    const endereco = {
      principal: [
        pedido.entrega_logradouro,
        pedido.entrega_numero && `, ${pedido.entrega_numero}`,
        pedido.entrega_bairro && ` - ${pedido.entrega_bairro}`,
      ]
        .filter(Boolean)
        .join(""),
      cidade: [
        pedido.entrega_municipio,
        pedido.entrega_uf && ` - ${pedido.entrega_uf}`,
      ]
        .filter(Boolean)
        .join(""),
      cep: pedido.entrega_cep || "-",
    };

    // Transportadora/Previsão (se não houver, use defaults amigáveis)
    const transportadora =
      (pedido.tipo_entrega === "entrega" && "Transportadora") || "Loja";
    const previsao = fmtDate(pedido.data_entrega) || "—";

    // Timeline (heurística baseada em estado/mp_status)
    const estado = String(pedido.estado || "").toLowerCase();
    const mp = String(pedido.mp_status || "").toLowerCase();
    const isAprovado = mp === "approved" || Number(pedido.pago) === 1;

    const emTransporte =
      pedido.tipo_entrega === "entrega" &&
      (estado.includes("enviado") ||
        estado.includes("transporte") ||
        estado.includes("entreg"));

    const entregue = estado.includes("entreg");

    const timeline = [
      {
        etapa: "Pedido recebido",
        completed: true,
        data: fmtDate(pedido.data_pedido || pedido.dataVenda),
      },
      {
        etapa: "Em transporte",
        completed: emTransporte || entregue || isAprovado, // marca como em trânsito após aprovado (ajuste se preferir)
        data:
          pedido.tipo_entrega === "entrega"
            ? fmtDate(pedido.data_pedido)
            : null,
      },
      {
        etapa: "Pedido entregue",
        completed: entregue,
        data: entregue ? fmtDate(pedido.data_entrega) : null,
      },
    ];

    return {
      id: pedido.id,
      dataRealizacao: fmtDate(pedido.data_pedido || pedido.dataVenda),
      entrega: {
        transportadora,
        previsao,
        timeline,
      },
      itens,
      endereco,
      formaPagamento: mapFormaPagamento(pedido.forma_pagamento),
      resumo: {
        subtotal,
        frete,
        descontos: descontos > 0 ? descontos : 0,
        valorTotal: totalVenda,
      },
    };
  }, [pedido]);

  if (loading) {
    return <div className={styles.pageWrapper}>Carregando pedido...</div>;
  }

  if (erro) {
    return (
      <div className={styles.pageWrapper}>
        <p className={styles.errorText}>{erro}</p>
        <div className={styles.footer}>
          <Link href="/perfil" passHref>
            <button className={styles.backButton}>VOLTAR PARA PEDIDOS</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!view) {
    return <div className={styles.pageWrapper}>Pedido não encontrado.</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Detalhes do pedido</h1>
      </header>

      <div className={styles.contentWrapper}>
        {/* COLUNA ESQUERDA */}
        <div className={styles.leftColumn}>
          <div className={styles.deliveryHeader}>
            <span className={styles.deliveryTitle}>Entrega 1</span>
            <span className={styles.sellerInfo}>
              Vendido e entregue por{" "}
              <strong>{view.entrega.transportadora}</strong>
            </span>
          </div>

          <Timeline timeline={view.entrega.timeline} />

          <p className={styles.deliveryPrediction}>
            Previsão de entrega: <strong>até {view.entrega.previsao}</strong>
          </p>

          {/* ITENS DO PEDIDO */}
          <h2 className={styles.sectionTitle}>Itens do pedido</h2>
          <div className={styles.itemsSection}>
            {view.itens.map((item, index) => (
              <div key={index} className={styles.itemCard}>
                <div className={styles.itemImageContainer} />
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>{item.nome}</p>
                  <p>
                    Quantidade: <strong>{item.quantidade}</strong>
                  </p>
                  <p>
                    Valor: <strong>{formatCurrency(item.valorUnitario)}</strong>
                  </p>
                  <p className={styles.itemTotalValue}>
                    Valor total:{" "}
                    <strong>
                      {formatCurrency(item.valorUnitario * item.quantidade)}
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className={styles.rightColumn}>
          <div className={styles.summaryBox}>
            <h3 className={styles.summaryTitle}>Resumo do pedido</h3>

            <p className={styles.summaryId}>
              Pedido <strong>{view.id}</strong>
              <br />
              Realizado em <strong>{view.dataRealizacao}</strong>
            </p>

            <h4 className={styles.summarySubtitle}>Endereço de entrega</h4>
            <div className={styles.addressBlock}>
              <p className={styles.addressType}>Principal</p>
              <p>{view.endereco.principal}</p>
              <p>{view.endereco.cidade}</p>
              <p>CEP: {view.endereco.cep}</p>
            </div>

            <h4 className={styles.summarySubtitle}>Forma de pagamento</h4>
            <div className={styles.paymentMethod}>
              <span className={styles.paymentIcon}>
                <img
                  src="/mock-pix-icon.svg"
                  alt="Pix"
                  style={{ width: "20px", height: "20px" }}
                />
              </span>
              <span className={styles.paymentText}>{view.formaPagamento}</span>
              <span className={styles.paymentValue}>
                {formatCurrency(view.resumo.valorTotal)}
              </span>
            </div>

            <h4 className={styles.summarySubtitle}>Total da Compra</h4>

            <div className={styles.priceDetail}>
              <span>Subtotal de produtos</span>
              <span>{formatCurrency(view.resumo.subtotal)}</span>
            </div>

            <div className={styles.priceDetail}>
              <span>Frete</span>
              <span className={styles.freeShipping}>
                {view.resumo.frete === 0
                  ? "Grátis"
                  : formatCurrency(view.resumo.frete)}
              </span>
            </div>

            <div className={styles.priceDetail}>
              <span>Descontos</span>
              <span className={styles.discount}>
                -{formatCurrency(view.resumo.descontos)}
              </span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Valor total</span>
              <span className={styles.totalValue}>
                {formatCurrency(view.resumo.valorTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Link href="/perfil" passHref>
          <button className={styles.backButton}>VOLTAR PARA PEDIDOS</button>
        </Link>
      </div>
    </div>
  );
}
