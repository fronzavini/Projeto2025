"use client";
import { useState } from "react";
import TabelaDesconto from "@/app/components/descontos/tabelaDescontos";
import CadastrarDesconto from "@/app/components/descontos/cadastrarDesconto";
import BotaoGenerico from "@/app/components/botao";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/tabelas.module.css";

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
