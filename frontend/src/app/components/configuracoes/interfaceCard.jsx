"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/configuracoes.module.css";

export default function InterfaceCard() {
  const [tema, setTema] = useState("claro");

  // Lê o tema do localStorage ao carregar
  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema") || "claro";
    setTema(temaSalvo);
    document.body.setAttribute(
      "data-theme",
      temaSalvo === "escuro" ? "dark" : "light"
    );
  }, []);

  const aplicarTema = (novoTema) => {
    setTema(novoTema);
    localStorage.setItem("tema", novoTema);
    document.body.setAttribute(
      "data-theme",
      novoTema === "escuro" ? "dark" : "light"
    );
  };

  return (
    <section className={styles.section}>
      <h3>
        <FontAwesomeIcon icon={faDesktop} className={styles.icone} /> Interface
      </h3>
      <label>Tema:</label>
      <select
        value={tema}
        onChange={(e) => aplicarTema(e.target.value)}
        className={styles.select}
      >
        <option value="claro">Claro</option>
        <option value="escuro">Escuro</option>
      </select>
    </section>
  );
}
