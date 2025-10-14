"use client";
import styles from "../styles/cards.module.css";

export default function Cards() {
  const cards = [
    { title: "Encomendas para hoje", value: 4, principal: true },
    { title: "Total de vendas", value: "21 R$2.200" },
    { title: "Em estoque mínimo", value: 5 },
  ];

  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${styles.card} ${card.principal ? styles.principal : ""}`}
        >
          <p className={styles.title}>{card.title}</p>
          <p className={styles.value}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}