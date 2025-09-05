import { useState } from "react";
import TabelaDesconto from "../components/tabelaDesconto";
import CadastrarDesconto from "../components/cadastrarDesconto";
import BotaoGenerico from "../components/botao";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/tabelas.module.css";

export default function Desconto() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        onClick={() => setShowPopup(true)}
        texto="Novo Desconto"
        icone={faPlus}
      />

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
