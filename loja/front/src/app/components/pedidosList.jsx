"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faWarehouse,
  faTruck,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/pedidos.module.css";

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

        <button className={styles.cancelButton}>CANCELAR PEDIDO</button>
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
            query: { dados: JSON.stringify(pedido) }, // ENVIA O PEDIDO COMPLETO
          }}
          passHref
        >
          <button className={styles.detailsButton}>VER DETALHES</button>
        </Link>
      </div>
    </div>
  );
};

// -------- MOCK COMPLETO DO PEDIDO --------
const pedidosMock = [
  {
    id: "1",
    status: "transporte",
    dataRealizacao: "20/11/2025",

    entrega: {
      previsao: "25/11/2025",
      transportadora: "Correios",
      timeline: [
        {
          etapa: "Pedido realizado",
          data: "20/11/2025",
          hora: "10:00",
          completed: true,
        },
        {
          etapa: "Pagamento confirmado",
          data: "20/11/2025",
          hora: "10:05",
          completed: true,
        },
        {
          etapa: "Em separação",
          data: "21/11/2025",
          hora: "14:00",
          completed: true,
        },
        {
          etapa: "Em transporte",
          data: "22/11/2025",
          hora: "09:00",
          completed: true,
        },
        { etapa: "Pedido entregue", completed: false },
      ],
    },

    endereco: {
      principal: "Rua das Flores, 123",
      cidade: "Curitiba - PR",
      cep: "80000-000",
    },

    formaPagamento: "Pix",

    resumo: {
      subtotal: 149.9,
      frete: 0,
      descontos: 0,
      valorTotal: 149.9,
    },

    itens: [
      {
        nome: "Buquê Tulipas Vermelhas",
        quantidade: 1,
        valorUnitario: 149.9,
        cor: "Vermelho",
        tamanho: "Único",
        imageUrl: "https://placehold.co/150x150/red/fff?text=Tulipa",
      },
    ],
  },
];

const PedidosList = () => {
  return (
    <div className={styles.listContainer}>
      {pedidosMock.map((pedido) => (
        <PedidoCard key={pedido.id} pedido={pedido} />
      ))}
    </div>
  );
};

export default PedidosList;
