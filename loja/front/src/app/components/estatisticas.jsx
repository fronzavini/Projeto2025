import React from "react";
import styles from "../styles/estatisticas.module.css";

export default function Estatisticas() {
  return (
    <div className={styles.estatisticas}>
      <div>
        <h3>200+</h3>
        <p>Clientes transformados</p>
      </div>
      <div>
        <h3>85%</h3>
        <p>Satisfação entre clientes</p>
      </div>
      <div>
        <h3>1.000+</h3>
        <p>Flores cultivadas à mão</p>
      </div>
    </div>
  );
}
