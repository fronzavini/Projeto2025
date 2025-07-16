import { useState } from "react";

import styles from "../styles/tabelas.module.css";
import TabelaProduto from "../components/TabelaProdutos";
import BotaoProduto from "../components/BotaoProduto";
import CadastrarProduto from "../components/CadastrarProduto";

export default function Produto() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoProduto onClick={() => setShowPopup(true)} />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarProduto onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <TabelaProduto />
    </div>
  );
}
