import BotaoFinanceiro from "../components/BotaoFinanceiro";
import CadastrarFinanceiro from "../components/CadastrarFinanceiro";
import CardFinanceiro from "../components/CardFinanceiro";
import TabelaFinanceiro from "../components/TabelaFinanceiro";
import styles from "../styles/tabelas.module.css";
import { useState } from "react";

export default function Clientes() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <div className={styles.financeiro}>
      <BotaoFinanceiro onClick={() => setShowPopup(true)} />

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
