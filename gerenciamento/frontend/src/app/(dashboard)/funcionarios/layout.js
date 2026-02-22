"use client";


import MenuFuncionario from "@/app/components/funcionarios/menuFuncionario";
import styles from "../../styles/menuVendas.module.css";

export default function VendasLayout({ children }) {
  return (
    <div className={styles.container}>
      <MenuFuncionario />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
