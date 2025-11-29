"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/configuracoes.module.css";

export default function InterfaceCard({ tema, setTema }) {
  return (
    <section className={styles.section}>
      <h3>
        <FontAwesomeIcon icon={faDesktop} className={styles.icone} /> Interface
      </h3>

      <label>Tema:</label>
      <select
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        className={styles.select}
      >
        <option value="claro">Claro</option>
        <option value="escuro">Escuro</option>
      </select>
    </section>
  );
}
