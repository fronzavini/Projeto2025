"use client";
import styles from "../styles/cards.module.css";

export default function Cards() {
  const cards = [
    {
      title: "Encomendas para hoje",
      value: 4,
      color: "#D497F0",
      textColor: "#ffffffff",
    },
    {
      title: "Total de vendas",
      value: "21 R$2.200",
      color: "#fff",
      textColor: "#000",
    },
    { title: "Em estoque mínimo", value: 5, color: "#fff", textColor: "#000" },
  ];

  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => (
        <div
          key={index}
          className={styles.card}
          style={{ backgroundColor: card.color, color: card.textColor }}
        >
          <p className={styles.title}>{card.title}</p>
          <p className={styles.value}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
