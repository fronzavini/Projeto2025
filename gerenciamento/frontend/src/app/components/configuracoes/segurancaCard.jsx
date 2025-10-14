import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/configuracoes.module.css";

export default function SegurancaCard({
  senhaInatividade,
  setSenhaInatividade,
  autenticacao2FA,
  setAutenticacao2FA,
}) {
  return (
    <section className={styles.section}>
      <h3>
        <FontAwesomeIcon icon={faLock} className={styles.icone} /> Segurança
      </h3>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={senhaInatividade}
          onChange={() => setSenhaInatividade(!senhaInatividade)}
        />
        Solicitar senha após inatividade
      </label>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={autenticacao2FA}
          onChange={() => setAutenticacao2FA(!autenticacao2FA)}
        />
        Ativar autenticação em dois fatores (2FA)
      </label>
    </section>
  );
}
