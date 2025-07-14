import { useState } from "react";
import BotaoCliente from "../components/BotaoCliente";
import CadastrarCliente from "../components/CadastrarCliente";
import Tabela from "../components/tabela";
import styles from "../styles/tabelas.module.css";

export default function Clientes() {

    const [showPopup, setShowPopup] = useState(false);
  
    return (
      <div>
        <BotaoCliente onClick={() => setShowPopup(true)} />
  
        {showPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <CadastrarCliente onClose={() => setShowPopup(false)} />
            </div>
          </div>
        )}
  
        <Tabela />
      </div>
    );
  }
