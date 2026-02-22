"use client";
import React from "react";
import styles from "../styles/secao.module.css";

export default function Secao({
  imagem,
  titulo,
  subtitulo,
  texto,
  botao,
  invertido,
}) {
  return (
    <section className={`${styles.secao} ${invertido ? styles.invertido : ""}`}>
      <img src={imagem} alt={titulo} className={styles.imagem} />
      <div className={styles.texto}>
        <h2>{titulo}</h2>
        {subtitulo && <h3 className={styles.subtitulo}>{subtitulo}</h3>}
        <p>{texto}</p>
        {botao && <button>{botao}</button>}
      </div>
    </section>
  );
}
