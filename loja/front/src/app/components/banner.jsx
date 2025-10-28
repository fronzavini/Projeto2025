import React from "react";
import styles from "../styles/banner.module.css";

export default function Banner({ imagem, titulo, texto }) {
  return (
    <div className={styles.banner}>
      <img src={imagem} alt={titulo} className={styles.bannerImage} />
      <h2 className={styles.titulo}>{titulo}</h2>
      <p className={styles.texto}>{texto}</p>
    </div>
  );
}
