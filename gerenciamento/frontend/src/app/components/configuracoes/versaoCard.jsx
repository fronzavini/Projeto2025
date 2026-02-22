import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faSync } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/configuracoes.module.css";

export default function VersaoCard() {
  return (
    <section className={styles.section}>
      <h3>
        <FontAwesomeIcon icon={faBox} className={styles.icone} /> Versão
      </h3>
      <p>
        Versão atual: <strong>v1.2.3</strong>
      </p>
      <p>
        Última atualização: <strong>31/07/2025</strong>
      </p>
      <br />
      <button className={styles.botao}>
        <FontAwesomeIcon icon={faSync} /> Verificar atualizações
      </button>
    </section>
  );
}
