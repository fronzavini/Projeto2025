// src/components/DetalhesPedido.js
"use client";
import React from "react";
import Link from "next/link";
import { FaCheckCircle, FaTruck, FaBoxOpen } from "react-icons/fa";
import styles from "../styles/detalhesPedido.module.css";

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

export default function DetalhesPedido({ pedido }) {
  if (!pedido) {
    return <div className={styles.pageWrapper}>Pedido não encontrado.</div>;
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);

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
              <strong>{pedido.entrega.transportadora}</strong>
            </span>
          </div>

          <Timeline timeline={pedido.entrega.timeline} />

          <p className={styles.deliveryPrediction}>
            Previsão de entrega: <strong>até {pedido.entrega.previsao}</strong>
          </p>

          <button className={styles.cancelButton}>CANCELAR PEDIDO</button>

          {/* ITENS DO PEDIDO */}
          <h2 className={styles.sectionTitle}>Itens do pedido</h2>
          <div className={styles.itemsSection}>
            {pedido.itens.map((item, index) => (
              <div key={index} className={styles.itemCard}>
                <div className={styles.itemImageContainer}></div>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>{item.nome}</p>

                  {/* ❌ Removidos: Cor e Tamanho */}

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
              Pedido <strong>{pedido.id}</strong>
              <br />
              Realizado em <strong>{pedido.dataRealizacao}</strong>
            </p>

            <h4 className={styles.summarySubtitle}>Endereço de entrega</h4>
            <div className={styles.addressBlock}>
              <p className={styles.addressType}>Principal</p>
              <p>{pedido.endereco.principal}</p>
              <p>{pedido.endereco.cidade}</p>
              <p>CEP: {pedido.endereco.cep}</p>
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
              <span className={styles.paymentText}>
                {pedido.formaPagamento}
              </span>
              <span className={styles.paymentValue}>
                {formatCurrency(pedido.resumo.valorTotal)}
              </span>
            </div>

            <h4 className={styles.summarySubtitle}>Total da Compra</h4>

            <div className={styles.priceDetail}>
              <span>Subtotal de produtos</span>
              <span>{formatCurrency(pedido.resumo.subtotal)}</span>
            </div>

            <div className={styles.priceDetail}>
              <span>Frete</span>
              <span className={styles.freeShipping}>
                {pedido.resumo.frete === 0
                  ? "Grátis"
                  : formatCurrency(pedido.resumo.frete)}
              </span>
            </div>

            <div className={styles.priceDetail}>
              <span>Descontos</span>
              <span className={styles.discount}>
                -{formatCurrency(pedido.resumo.descontos)}
              </span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Valor total</span>
              <span className={styles.totalValue}>
                {formatCurrency(pedido.resumo.valorTotal)}
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
