"use client";
import { useState } from "react";
import styles from "../../styles/tabelas.module.css";
import TabelaFornecedores from "@/app/components/fornecedores/tabelaFornecedores";
import CadastrarFornecedor from "@/app/components/fornecedores/cadastrarFornecedor";
import BotaoGenerico from "@/app/components/botao";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Fornecedores() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        onClick={() => setShowPopup(true)}
        texto="Novo Fornecedor"
        icone={faPlus}
      />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarFornecedor onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <TabelaFornecedores />
    </div>
  );
}
