import { useState } from "react";
import BotaoDesconto from "../components/BotaoDesconto";
import TabelaDesconto from "../components/TabelaDesconto";
import styles from "../styles/tabelas.module.css";
import CadastrarDesconto from "../components/CadastrarDesconto";

export default function Desconto() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div>
      <BotaoDesconto onClick={() => setShowPopup(true)} />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarDesconto onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}
      <TabelaDesconto />
    </div>
  );
}
