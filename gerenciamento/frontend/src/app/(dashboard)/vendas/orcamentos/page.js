"use client";
import { useState } from "react";
import TabelaOrcamentos from "@/app/components/vendas/tabelaOrcamentos";
import CadastrarOrcamento from "@/app/components/vendas/cadastrarOrcamento";
import BotaoGenerico from "../../../components/botao";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/tabelas.module.css";

export default function Orcamentos() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        onClick={() => setShowPopup(true)}
        texto="Novo Orçamento"
        icone={faPlus}
      />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarOrcamento onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <TabelaOrcamentos />
    </div>
  );
}
