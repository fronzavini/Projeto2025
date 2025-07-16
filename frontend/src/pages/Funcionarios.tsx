import { useState } from "react";
import TabelaFuncionario from "../components/TabelaFuncionarios";
import styles from "../styles/tabelas.module.css";
import CadastrarFuncionario from "../components/CadastrarFuncionario";
import BotaoFuncionario from "../components/BotaoFuncionario";

export default function Funcionarios() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoFuncionario onClick={() => setShowPopup(true)} />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarFuncionario onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <TabelaFuncionario />
    </div>
  );
}
