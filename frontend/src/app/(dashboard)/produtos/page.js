"use client";
import { useState } from "react";
import TabelaProduto from "@/app/components/produtos/tabelaProdutos";
import CadastrarProduto from "@/app/components/produtos/cadastrarProduto";
import BotaoGenerico from "@/app/components/botao";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/tabelas.module.css";

export default function Produto() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        onClick={() => setShowPopup(true)}
        texto="Novo Produto"
        icone={faPlus}
      />

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
