import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faWarehouse,
  faTruck,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/pedidos.module.css";

const PedidosList = ({ pedidos = [] }) => {
  if (pedidos.length === 0) {
    return <div className={styles.noOrders}>Nenhum pedido encontrado.</div>;
  }

  const simplePedido = pedidos[0];

  const statusMap = {
    Entregue: "entregue",
    "Em transporte": "transporte",
    "Em separação": "separacao",
  };

  const detailedOrderData = {
    productName: "Dália - Flor Unitária",
    quantity: "1",
    value: "R$ 14,99",
    seller: "BellaDonna",
    orderId: simplePedido.id,
    orderDate: simplePedido.data,
    totalValue: simplePedido.valor.toFixed(2),
    deliveryDate: "10/12/2025",

    // <--- CORREÇÃO DE TESTE: Força o status para "realizado" --->
    currentStatus: "realizado",

    imageSrc:
      "https://i.pinimg.com/736x/5b/a3/b5/5ba3b51339575c16e9a4c238f62766ee.jpg",
  };

  const {
    productName,
    quantity,
    value,
    seller,
    orderId,
    orderDate,
    totalValue,
    deliveryDate,
    currentStatus,
    imageSrc,
  } = detailedOrderData;

  const trackingSteps = [
    {
      name: "Pedido realizado",
      date: "28/11/2025",
      time: "08:50",
      icon: faBox,
      status: "realizado",
    },
    {
      name: "Em separação",
      date: "28/11/2025",
      time: "08:50",
      icon: faWarehouse,
      status: "separacao",
    },
    {
      name: "Em transporte",
      date: "",
      time: "",
      icon: faTruck,
      status: "transporte",
    },
    {
      name: "Pedido entregue",
      date: "",
      time: "",
      icon: faHome,
      status: "entregue",
    },
  ];

  const getStatusClass = (stepStatus) => {
    const statusOrder = trackingSteps.map((step) => step.status);
    const currentStatusIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex <= currentStatusIndex) {
      return styles.active;
    }
    return styles.inactive;
  };

  const currentStatusIndexForTracking = trackingSteps.findIndex(
    (step) => step.status === currentStatus
  );

  const totalSteps = trackingSteps.length - 1;
  const progressBarWidth = (currentStatusIndexForTracking / totalSteps) * 100;

  return (
    <div className={styles.container}>
      {/* Coluna do Produto */}
      <div className={styles.productColumn}>
        <div className={styles.productImageWrapper}>
          <img
            src={imageSrc}
            alt={productName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <p className={styles.productName}>
          <strong>{productName}</strong>
        </p>

        <p>
          Quantidade: <strong>{quantity}</strong>
        </p>
        <p>
          Valor: <strong>{value}</strong>
        </p>
      </div>

      {/* Coluna Central de Acompanhamento */}
      <div className={styles.trackingColumn}>
        <p className={styles.sellerInfo}>
          Vendido e entregue por <strong>{seller}</strong>
        </p>

        {/* Barra de Progresso do Rastreamento */}
        <div className={styles.trackingBar}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressBarWidth}%` }}
            ></div>
          </div>

          <div className={styles.steps}>
            {trackingSteps.map((step, index) => (
              <div
                key={step.status}
                className={`${styles.step} ${getStatusClass(step.status)}`}
              >
                <div className={styles.stepIcon}>
                  <FontAwesomeIcon icon={step.icon} />
                </div>
                <div className={styles.stepInfo}>
                  <p className={styles.stepDate}>
                    {step.date} {step.time}
                  </p>
                  <p className={styles.stepName}>{step.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className={styles.deliveryForecast}>
          Previsão de entrega: <strong>até {deliveryDate}</strong>
        </p>

        <button className={styles.cancelButton}>CANCELAR PEDIDO</button>
      </div>

      {/* Coluna de Resumo */}
      <div className={styles.summaryColumn}>
        <h3 className={styles.summaryTitle}>Resumo da compra</h3>
        <p>
          Pedido: <strong>{orderId}</strong>
        </p>
        <p>
          Data do pedido: <strong>{orderDate}</strong>
        </p>
        <p>
          Valor total: <strong>R$ {totalValue}</strong>
        </p>

        <button className={styles.detailsButton}>VER DETALHES</button>
      </div>
    </div>
  );
};

export default PedidosList;
