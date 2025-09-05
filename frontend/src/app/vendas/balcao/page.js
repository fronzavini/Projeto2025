"use client";
import { useState } from "react";
import TabelaVendas from "@/app/components/vendas/tabelaVendas";
import CadastrarVenda from "@/app/components/vendas/cadastrarVenda";
import BotaoGenerico from "@/app/components/botao";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/tabelas.module.css";

export default function Balcao() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        onClick={() => setShowPopup(true)}
        texto="Nova Venda"
        icone={faPlus}
      />

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
