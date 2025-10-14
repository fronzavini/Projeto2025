"use client";
import { useState } from "react";
import TabelaCupom from "@/app/components/descontos/tabelaCupons";
import CadastrarCupom from "@/app/components/descontos/cadastrarCupom";
import BotaoGenerico from "@/app/components/botao";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/tabelas.module.css";

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
