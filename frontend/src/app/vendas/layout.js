"use client";

import MenuVendas from "../components/vendas/menuVendas";
import styles from "../styles/vendasLayout.module.css";

export default function VendasLayout({ children }) {
  return (
    <div className={styles.container}>
      <MenuVendas />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
