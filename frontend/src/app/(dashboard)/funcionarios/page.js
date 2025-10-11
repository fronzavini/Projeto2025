"use client";

import { useState } from "react";
import TabelaFuncionario from "@/app/components/funcionarios/tabelaFuncionarios";
import CadastrarFuncionario from "@/app/components/funcionarios/cadastrarFuncionario";
import BotaoGenerico from "@/app/components/botao";
import styles from "../../styles/tabelas.module.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Funcionarios() {
  const [showPopup, setShowPopup] = useState(false);
  const [showImportPopup, setImportPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        onClick={() => setShowPopup(true)}
        texto="Novo Funcionário"
        icone={faPlus}
      />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarFuncionario onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <BotaoGenerico
        texto="Importar por csv"
        icone={faPlus}
        onClick={() => setImportPopup(true)}
      />

      {showImportPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <ImportarCsv onClose={() => setImportPopup(false)} />
          </div>
        </div>
      )}

      <TabelaFuncionario />
    </div>
  );
}
