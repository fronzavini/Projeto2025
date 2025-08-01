import BotaoCupom from "../components/BotaoCupom";
import CadastrarCupom from "../components/CadastrarCupom";
import TabelaCupom from "../components/TabelaCupom";
import styles from "../styles/tabelas.module.css";
import { useState } from "react";

export default function Cupom() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div>
      <BotaoCupom onClick={() => setShowPopup(true)} />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarCupom onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}
      <TabelaCupom />
    </div>
  );
}
