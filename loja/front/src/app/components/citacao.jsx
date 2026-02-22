import React from "react";
import styles from "../styles/citacao.module.css";

export default function Citacao({ texto, autor }) {
  return (
    <div className={styles.citacao}>
      <p className={styles.aspas}>“</p>
      <p className={styles.texto}>{texto}</p>
      <p className={styles.autor}>{autor}</p>
    </div>
  );
}
