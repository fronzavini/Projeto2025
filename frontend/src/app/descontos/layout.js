"use client";

import MenuDescontos from "../components/descontos/menuDescontos";
import styles from "../styles/vendasLayout.module.css";

export default function DescontosLayout({ children }) {
  return (
    <div className={styles.container}>
      <MenuDescontos />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
