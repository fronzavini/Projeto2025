import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/configuracoes.module.css";

export default function IdiomaCard({ idioma, setIdioma }) {
  return (
    <section className={styles.section}>
      <h3>
        <FontAwesomeIcon icon={faGlobe} className={styles.icone} /> Idioma
      </h3>
      <select
        value={idioma}
        onChange={(e) => setIdioma(e.target.value)}
        className={styles.select}
      >
        <option value="pt-BR">Português (Brasil)</option>
        <option value="en-US">Inglês (EUA)</option>
        <option value="es-ES">Espanhol</option>
      </select>
    </section>
  );
}
