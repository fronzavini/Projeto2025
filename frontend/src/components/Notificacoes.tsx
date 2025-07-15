import { useState, useRef, useEffect } from "react";
import styles from "../styles/Notificacoes.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
}

const notificacoes: Notificacao[] = [
  {
    id: 1,
    titulo: "Pedido novo atribuído",
    mensagem: "Você foi designado para o pedido #1234.",
    data: "15/07/2025",
    lida: false,
  },
  {
    id: 2,
    titulo: "Relatório pendente",
    mensagem: "O relatório mensal precisa ser finalizado até sexta.",
    data: "14/07/2025",
    lida: true,
  },
];

export default function Notificacoes() {
  const [aberto, setAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button className={styles.botao} onClick={() => setAberto(!aberto)}>
        <FontAwesomeIcon icon={faBell} className={styles.icone} />
        {notificacoesNaoLidas > 0 && (
          <span className={styles.contador}>{notificacoesNaoLidas}</span>
        )}
      </button>

      {aberto && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h4 className={styles.titulo}>Notificações</h4>
            <button className={styles.fechar} onClick={() => setAberto(false)}>
              ×
            </button>
          </div>

          {notificacoes.length === 0 ? (
            <p className={styles.vazio}>Nenhuma notificação no momento.</p>
          ) : (
            notificacoes.map((n) => (
              <div
                key={n.id}
                className={`${styles.notificacao} ${n.lida ? styles.lida : ""}`}
              >
                <div className={styles.cabecalho}>
                  <strong>{n.titulo}</strong>
                  <span className={styles.data}>{n.data}</span>
                </div>
                <p>{n.mensagem}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
