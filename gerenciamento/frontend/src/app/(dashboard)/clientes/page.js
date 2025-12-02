"use client";

import { useState } from "react";
import BotaoGenerico from "@/app/components/botao";
import ImportarCsv from "@/app/components/importarCsv";
import CadastrarCliente from "@/app/components/clientes/cadastrarCliente";
import TabelaClientes from "@/app/components/clientes/tabelaClientes";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/tabelas.module.css";

export default function Clientes() {
  const [showPopup, setShowPopup] = useState(false);
  const [showImportPopup, setImportPopup] = useState(false);

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


      {showImportPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <ImportarCsv onClose={() => setImportPopup(false)} />
          </div>
        </div>
      )}

      <TabelaClientes />
    </div>
  );
}
