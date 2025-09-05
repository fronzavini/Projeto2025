"use client";

import { useState } from "react";
import BotaoGenerico from "../components/botao";
import CadastrarFinanceiro from "../components/financeiro/cadastrarFinanceiro";
import CardFinanceiro from "../components/financeiro/cardFinanceiro";
import TabelaFinanceiro from "../components/financeiro/tabelaFinanceiro";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/tabelas.module.css";

export default function Financeiro() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <div className={styles.financeiro}>
        <BotaoGenerico
          texto="Cadastrar Transação"
          icone={faPlus}
          onClick={() => setShowPopup(true)}
        />

        {showPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <CadastrarFinanceiro onClose={() => setShowPopup(false)} />
            </div>
          </div>
        )}

        <CardFinanceiro />
      </div>

      <TabelaFinanceiro />
    </div>
  );
}
