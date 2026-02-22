"use client";

import MenuDescontos from "@/app/components/descontos/menuDescontos";
import styles from "../../styles/menuVendas.module.css";

export default function DescontosLayout({ children }) {
  return (
    <div className={styles.container}>
      <MenuDescontos />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
