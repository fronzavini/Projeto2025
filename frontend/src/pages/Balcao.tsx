import { useState } from "react";
import BotaoVenda from "../components/BotaoVendas";
import TabelaVendas from "../components/TabelaVendas";
import styles from "../styles/tabelas.module.css";
import CadastrarVenda from "../components/CadastrarVenda";

export default function Balcao() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoVenda onClick={() => setShowPopup(true)} />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarVenda onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <TabelaVendas />
    </div>
  );
}
