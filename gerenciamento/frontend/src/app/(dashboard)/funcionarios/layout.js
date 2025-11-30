"use client";

import menuFuncionario from "../../components/funcionarios/menuFuncionario";
import styles from "../../styles/menuVendas.module.css";

export default function VendasLayout({ children }) {
  return (
    <div className={styles.container}>
      <menuFuncionario />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
