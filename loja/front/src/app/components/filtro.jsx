"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/filtro.module.css";

export default function Filtro() {
  return (
    <button className={styles.filtroBtn}>
      <FontAwesomeIcon icon={faSliders} className={styles.icon} />
      <span>Filtrar por</span>
    </button>
  );
}
