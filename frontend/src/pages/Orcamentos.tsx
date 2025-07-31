import BotaoOrcamento from "../components/BotaoOrcamentos";
import TabelaOrcamentos from "../components/TabelaOrcamentos";
import { useState } from "react";
import styles from "../styles/tabelas.module.css";
import CadastrarOrcamento from "../components/CadastrarOrcamento";

export default function Orcamentos() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoOrcamento onClick={() => setShowPopup(true)} />

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
