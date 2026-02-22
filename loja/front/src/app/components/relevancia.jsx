"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignal } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/filtro.module.css";

export default function Relevancia({ onChange }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    onChange && onChange(value); // chama função do pai se existir
    setOpen(false); // fecha o dropdown
  };

  return (
    <div className={styles.dropdownContainer}>
      <button
        className={styles.filtroBtn}
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={faSignal} className={styles.icon} />
        <span>Relevância</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <button
            className={styles.option}
            onClick={() => handleSelect("preco-asc")}
          >
            Menor preço → Maior preço
          </button>
          <button
            className={styles.option}
            onClick={() => handleSelect("preco-desc")}
          >
            Maior preço → Menor preço
          </button>
        </div>
      )}
    </div>
  );
}
