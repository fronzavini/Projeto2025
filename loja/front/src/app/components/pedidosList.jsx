// components/PedidosList.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faWarehouse,
  faTruck,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/pedidos.module.css";

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://127.0.0.1:5000";

/* ---------------- PedidoCard (sem mudanças visuais) ---------------- */
const PedidoCard = ({ pedido }) => {
  const trackingSteps = [
    { name: "Pedido realizado", icon: faBox, status: "realizado" },
    { name: "Em separação", icon: faWarehouse, status: "separacao" },
    { name: "Em transporte", icon: faTruck, status: "transporte" },
    { name: "Pedido entregue", icon: faHome, status: "entregue" },
  ];

  const firstItem = pedido.itens[0];
  const currentStatus = pedido.status;

  const getStatusClass = (stepStatus) => {
    const order = ["realizado", "separacao", "transporte", "entregue"];
    return order.indexOf(stepStatus) <= order.indexOf(currentStatus)
      ? styles.active
      : styles.inactive;
  };

  const progressBarWidth = (() => {
    const order = ["realizado", "separacao", "transporte", "entregue"];
    const index = order.indexOf(currentStatus);
    return (index / (order.length - 1)) * 100;
  })();

  return (
    <div className={styles.container}>
      {/* COLUNA ESQUERDA - PRODUTO */}
      <div className={styles.productColumn}>
        <div className={styles.productImageWrapper}>
          <img src={firstItem.imageUrl} alt={firstItem.nome} />
        </div>

        <p className={styles.productName}>
          <strong>{firstItem.nome}</strong>
        </p>

        <p>
          Quantidade: <strong>{firstItem.quantidade}</strong>
        </p>
        <p>
          Valor unitário:{" "}
          <strong>R$ {firstItem.valorUnitario.toFixed(2)}</strong>
        </p>
      </div>

      {/* COLUNA CENTRAL - RASTREAMENTO */}
      <div className={styles.trackingColumn}>
        <p className={styles.sellerInfo}>
          Vendido e entregue por <strong>Floricultura Lilian</strong>
        </p>

        <div className={styles.trackingBar}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressBarWidth}%` }}
            />
          </div>

          <div className={styles.steps}>
            {trackingSteps.map((step) => (
              <div
                key={step.status}
                className={`${styles.step} ${getStatusClass(step.status)}`}
              >
                <div className={styles.stepIcon}>
                  <FontAwesomeIcon icon={step.icon} />
                </div>
                <p className={styles.stepName}>{step.name}</p>
              </div>
            ))}
          </div>
        </div>

        <p className={styles.deliveryForecast}>
          Previsão de entrega: <strong>até {pedido.entrega.previsao}</strong>
        </p>

        <button
          className={styles.cancelButton}
          onClick={() => alert("Implementar rota de cancelamento (opcional).")}
        >
          CANCELAR PEDIDO
        </button>
      </div>

      {/* COLUNA DIREITA - RESUMO */}
      <div className={styles.summaryColumn}>
        <h3 className={styles.summaryTitle}>Resumo da compra</h3>

        <p>
          Pedido: <strong>{pedido.id}</strong>
        </p>
        <p>
          Data do pedido: <strong>{pedido.dataRealizacao}</strong>
        </p>
        <p>
          Valor total: <strong>R$ {pedido.resumo.valorTotal.toFixed(2)}</strong>
        </p>

        <Link
          href={{
            pathname: `/pedido/${pedido.id}`,
            query: { dados: JSON.stringify(pedido) },
          }}
          passHref
        >
          <button className={styles.detailsButton}>VER DETALHES</button>
        </Link>
      </div>
    </div>
  );
};

/* ---------------- Helpers de mapeamento ---------------- */
const estadoToStatusUI = (estado) => {
  // mapeia estados do banco -> passos do seu front
  const map = {
    recebido: "realizado",
    em_preparacao: "separacao",
    enviado: "transporte",
    entregue: "entregue",
    cancelado: "realizado", // mantém no início; ajuste se quiser outro tratamento
  };
  return map[String(estado || "").toLowerCase()] || "realizado";
};

const formatDate = (isoLike) => {
  try {
    if (!isoLike) return "";
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return String(isoLike);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return String(isoLike);
  }
};

// Se o backend devolver uma linha como array (SELECT padrão) ou dict, adaptamos:
const readField = (row, nameOrIndex) =>
  Array.isArray(row) ? row[nameOrIndex] : row?.[nameOrIndex];

/* ---------------- Adaptadores de backend -> UI ---------------- */
// PEDIDOS (preferencial)
function adaptPedidoRow(row) {
  // pedidos: (id, cliente_id, funcionario_id, data_pedido, forma_pagamento, estado, canal, valor_total, tipo_entrega, data_entrega)
  const id = Number(readField(row, 0) ?? row?.id);
  const data_pedido = readField(row, 3) ?? row?.data_pedido;
  const forma_pagamento = readField(row, 4) ?? row?.forma_pagamento;
  const estado = readField(row, 5) ?? row?.estado;
  const valor_total = Number(readField(row, 7) ?? row?.valor_total ?? 0);
  const data_entrega = readField(row, 9) ?? row?.data_entrega;

  // Aqui não temos itens via rota — criamos 1 item “placeholder”
  return {
    id: String(id),
    status: estadoToStatusUI(estado),
    dataRealizacao: formatDate(data_pedido),
    entrega: {
      previsao: formatDate(data_entrega) || "—",
      transportadora: "—",
      timeline: [], // se quiser, pode gerar timeline baseada no estado
    },
    endereco: { principal: "", cidade: "", cep: "" },
    formaPagamento: (forma_pagamento || "pix").toUpperCase(),
    resumo: {
      subtotal: valor_total,
      frete: 0,
      descontos: 0,
      valorTotal: valor_total,
    },
    itens: [
      {
        nome: "Produto do pedido",
        quantidade: 1,
        valorUnitario: valor_total,
        cor: "—",
        tamanho: "—",
        imageUrl: "/placeholder.png",
      },
    ],
  };
}

// VENDAS (fallback)
function adaptVendaRow(row) {
  // vendas: (id, cliente, funcionario, pedido, produtos(text JSON), valorTotal, dataVenda, pago)
  const id = Number(readField(row, 0) ?? row?.id);
  const valorTotal = Number(readField(row, 5) ?? row?.valorTotal ?? 0);
  const dataVenda = readField(row, 6) ?? row?.dataVenda;
  let itens = [];
  try {
    const produtosText = readField(row, 4) ?? row?.produtos;
    const arr =
      typeof produtosText === "string"
        ? JSON.parse(produtosText)
        : produtosText || [];
    itens = arr.map((p) => ({
      nome: `Produto #${p.id}`,
      quantidade: Number(p.quantidade || 1),
      valorUnitario: Number(p.preco || 0),
      cor: "—",
      tamanho: "—",
      imageUrl: "/placeholder.png",
    }));
  } catch {
    itens = [
      {
        nome: "Produto",
        quantidade: 1,
        valorUnitario: valorTotal,
        cor: "—",
        tamanho: "—",
        imageUrl: "/placeholder.png",
      },
    ];
  }

  return {
    id: String(id),
    status: "realizado", // vendas não tem estado de envio; começa no 1º passo
    dataRealizacao: formatDate(dataVenda),
    entrega: {
      previsao: "—",
      transportadora: "—",
      timeline: [],
    },
    endereco: { principal: "", cidade: "", cep: "" },
    formaPagamento: "PIX",
    resumo: {
      subtotal: valorTotal,
      frete: 0,
      descontos: 0,
      valorTotal: valorTotal,
    },
    itens,
  };
}

/* ---------------- Lista dinâmica de pedidos ---------------- */
const PedidosList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      setCarregando(true);
      setErro(null);

      try {
        // pega cliente_id do localStorage
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem("usuario_loja")
            : null;
        const user = raw ? JSON.parse(raw) : null;
        const clienteId = user?.cliente_id || user?.id;
        if (!clienteId) {
          setErro("Não foi possível identificar o cliente.");
          setCarregando(false);
          return;
        }

        // 1) tenta listar pedidos por cliente (se você tiver criado a rota)
        let pedidosList = [];
        let res = await fetch(
          `${BASE}/listar_pedidos?cliente_id=${encodeURIComponent(clienteId)}`,
          { cache: "no-store" }
        );

        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data?.detalhes || [];
          pedidosList = rows.map(adaptPedidoRow);
        } else {
          // 2) fallback: usa vendas e adapta
          res = await fetch(`${BASE}/listar_vendas`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const rows = Array.isArray(data) ? data : data?.detalhes || [];
            const rowsDoCliente = rows.filter((row) => {
              // vendas: cliente está na coluna 1 (ou row.cliente)
              const valor = readField(row, 1);
              return Number(valor) === Number(clienteId);
            });
            pedidosList = rowsDoCliente.map(adaptVendaRow);
          } else {
            throw new Error("Falha ao carregar pedidos.");
          }
        }

        setPedidos(pedidosList);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar seus pedidos.");
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  if (carregando) {
    return <div className={styles.listContainer}>Carregando pedidos...</div>;
  }
  if (erro) {
    return <div className={styles.listContainer}>{erro}</div>;
  }
  if (!pedidos.length) {
    return (
      <div className={styles.listContainer}>Você ainda não tem pedidos.</div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {pedidos.map((pedido) => (
        <PedidoCard key={pedido.id} pedido={pedido} />
      ))}
    </div>
  );
};

export default PedidosList;
