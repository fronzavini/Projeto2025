"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignal } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/filtro.module.css";

export default function Relevancia() {
  return (
    <button className={styles.filtroBtn}>
      <FontAwesomeIcon icon={faSignal} className={styles.icon} />
      <span>Relevância</span>
    </button>
  );
}
