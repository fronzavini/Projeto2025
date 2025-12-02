// src/app/components/PedidosList.jsx
"use client";
import React, { useEffect, useState } from "react";
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
  "http://191.52.6.89:5000";

/* ================= Helpers ================= */
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

// Se a linha de /listar_vendas vier como array (tupla) ou dict:
const F = (row, nameOrIndex) =>
  Array.isArray(row) ? row[nameOrIndex] : row?.[nameOrIndex];

const estadoToStatusUI = (estado, mpStatus) => {
  const e = String(estado || "").toLowerCase();
  const mp = String(mpStatus || "").toLowerCase();

  if (e.includes("entreg")) return "entregue";
  if (e.includes("envi") || e.includes("transport")) return "transporte";
  if (e.includes("prep") || e.includes("separ")) return "separacao";
  if (e.includes("cancel")) return "realizado";

  // se aprovado no MP mas sem estado claro, considerar em separação
  if (mp === "approved") return "separacao";

  return "realizado";
};

const currency = (n) =>
  `R$ ${Number(n || 0)
    .toFixed(2)
    .replace(".", ",")}`;

/* ============== Card visual ============== */
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
      {/* ESQUERDA - PRODUTO */}
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
          Valor unitário: <strong>{currency(firstItem.valorUnitario)}</strong>
        </p>
      </div>

      {/* CENTRO - RASTREAMENTO */}
      <div className={styles.trackingColumn}>
        <p className={styles.sellerInfo}>
          Vendido e entregue por{" "}
          <strong>{pedido.entrega.transportadora || "Loja"}</strong>
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
      </div>

      {/* DIREITA - RESUMO */}
      <div className={styles.summaryColumn}>
        <h3 className={styles.summaryTitle}>Resumo da compra</h3>
        <p>
          Pedido: <strong>{pedido.id}</strong>
        </p>
        <p>
          Data do pedido: <strong>{pedido.dataRealizacao}</strong>
        </p>
        <p>
          Valor total: <strong>{currency(pedido.resumo.valorTotal)}</strong>
        </p>

        {/* Envia o objeto 'pedido' na query string como 'dados' */}
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

/* ============== Adaptadores de backend -> UI ============== */
// A partir de /listar_vendas. Estrutura esperada (tupla ou dict):
// id(0), cliente(1), funcionario(2), pedido(3), produtos(text JSON)(4), valorTotal(5), dataVenda(6), pago(7)
function adaptVendaRow(row) {
  const id = Number(F(row, 0) ?? row?.id);
  const cli = Number(F(row, 1) ?? row?.cliente);
  const pedidoId = Number(F(row, 3) ?? row?.pedido);
  const valorTotal = Number(F(row, 5) ?? row?.valorTotal ?? 0);
  const dataVenda = F(row, 6) ?? row?.dataVenda;

  // itens a partir do JSON de 'produtos'
  let itens = [];
  try {
    const produtosText = F(row, 4) ?? row?.produtos;
    const arr =
      typeof produtosText === "string"
        ? JSON.parse(produtosText)
        : produtosText || [];
    itens = arr.map((p) => ({
      nome: `Produto #${p.id}`,
      quantidade: Number(p.quantidade || 1),
      valorUnitario: Number(p.preco || 0),
      imageUrl: "/placeholder.png",
      produtoId: Number(p.id),
    }));
  } catch {
    itens = [
      {
        nome: "Produto",
        quantidade: 1,
        valorUnitario: valorTotal,
        imageUrl: "/placeholder.png",
        produtoId: null,
      },
    ];
  }

  return {
    _clienteId: cli,
    _pedidoId: pedidoId || null,
    id: String(pedidoId || id), // mostramos o pedido quando existir
    status: "realizado", // será refinado com dados de /pedidos/:id
    dataRealizacao: formatDate(dataVenda),
    entrega: {
      transportadora: "Loja",
      previsao: "—",
    },
    resumo: {
      subtotal: valorTotal,
      frete: 0,
      descontos: 0,
      valorTotal,
    },
    itens,
  };
}

/* ============== Componente principal ============== */
const PedidosList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      setCarregando(true);
      setErro(null);
      try {
        // ID do cliente salvo no login da loja
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

        // 1) Carrega vendas e filtra pelo cliente
        const res = await fetch(`${BASE}/listar_vendas`, { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar vendas.");

        const data = await res.json();
        const rows = Array.isArray(data) ? data : data?.detalhes || [];
        let pedidosList = rows
          .map(adaptVendaRow)
          .filter((p) => Number(p._clienteId) === Number(clienteId));

        // 2) Enriquecer cada pedido com dados de /pedidos/:id
        const enriched = await Promise.all(
          pedidosList.map(async (p) => {
            if (!p._pedidoId) return p;
            try {
              const r = await fetch(`${BASE}/pedidos/${p._pedidoId}`, {
                cache: "no-store",
              });
              if (!r.ok) return p;
              const det = await r.json();

              const status = estadoToStatusUI(det?.estado, det?.mp_status);
              const previsao = formatDate(det?.data_entrega) || "—";
              const transportadora =
                det?.tipo_entrega === "entrega" ? "Transportadora" : "Loja";

              return {
                ...p,
                id: String(det?.id ?? p.id),
                status,
                dataRealizacao:
                  formatDate(det?.data_pedido || det?.dataVenda) ||
                  p.dataRealizacao,
                entrega: {
                  transportadora,
                  previsao,
                },
                resumo: {
                  ...p.resumo,
                  valorTotal: Number(
                    det?.valorTotal ?? det?.valor_total ?? p.resumo.valorTotal
                  ),
                },
              };
            } catch {
              return p;
            }
          })
        );

        // 3) Enriquecer imagem do primeiro item com /produto_id/:id
        const withImages = await Promise.all(
          enriched.map(async (p) => {
            const first = p.itens?.[0];
            if (!first?.produtoId) return p;
            try {
              const r = await fetch(`${BASE}/produto_id/${first.produtoId}`, {
                cache: "no-store",
              });
              if (!r.ok) return p;
              const prod = await r.json();
              const img = prod?.imagem_1 || prod?.imagem || "/placeholder.png";
              const nome = prod?.nome || first.nome;
              const itens = [
                { ...first, imageUrl: img, nome },
                ...p.itens.slice(1),
              ];
              return { ...p, itens };
            } catch {
              return p;
            }
          })
        );

        setPedidos(withImages);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar seus pedidos.");
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  if (carregando)
    return <div className={styles.listContainer}>Carregando pedidos...</div>;
  if (erro) return <div className={styles.listContainer}>{erro}</div>;
  if (!pedidos.length)
    return (
      <div className={styles.listContainer}>Você ainda não tem pedidos.</div>
    );

  return (
    <div className={styles.listContainer}>
      {pedidos.map((pedido) => (
        <PedidoCard key={pedido.id} pedido={pedido} />
      ))}
    </div>
  );
};

export default PedidosList;
