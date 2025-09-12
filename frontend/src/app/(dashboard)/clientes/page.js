"use client";

import { useState } from "react";
import BotaoGenerico from "@/app/components/botao";
import CadastrarCliente from "@/app/components/clientes/cadastrarCliente";
import TabelaClientes from "@/app/components/clientes/tabelaClientes";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/tabelas.module.css";
import carregarClientes from "@/app/components/clientes/tabelaClientes";

export default function Clientes() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <BotaoGenerico
        texto="Adicionar Cliente"
        icone={faUserPlus}
        onClick={() => setShowPopup(true)}
      />

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <CadastrarCliente onClose={() => {setShowPopup(false); carregarClientes();}} />
          </div>
        </div>
      )}

      <TabelaClientes />
    </div>
  );
}
