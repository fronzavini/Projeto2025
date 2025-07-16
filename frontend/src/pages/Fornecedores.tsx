import { useState } from "react";
import styles from "../styles/tabelas.module.css";
import TabelaFornecedores from "../components/TabelaFornecedores";
import CadastrarFornecedor from "../components/CadastrarFornecedor";
import BotaoFornecedor from "../components/BotaoFornecedor";

export default function Fornecedores() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoFornecedor onClick={() => setShowPopup(true)} />

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
