"use client";

import { useState } from "react";
import BotaoGenerico from "../components/botao";
import CadastrarCliente from "../components/clientes/cadastrarCliente";
import TabelaClientes from "../components/clientes/tabelaClientes";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/tabelas.module.css";

export default function Clientes() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        texto="Adicionar Cliente"
        icone={faUserPlus}
        onClick={() => setShowPopup(true)}
      />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarCliente onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <TabelaClientes />
    </div>
  );
}
