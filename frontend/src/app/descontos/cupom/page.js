import { useState } from "react";
import TabelaCupom from "../components/tabelaCupom";
import CadastrarCupom from "../components/cadastrarCupom";
import BotaoGenerico from "../../components/botao";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/tabelas.module.css";

export default function Cupom() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        onClick={() => setShowPopup(true)}
        texto="Novo Cupom"
        icone={faPlus}
      />

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
