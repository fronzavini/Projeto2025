import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/botao.module.css";

export default function BotaoGenerico({ onClick, texto, icone }) {
  return (
    <button className={styles.botao} onClick={onClick}>
      {icone && <FontAwesomeIcon icon={icone} style={{ marginRight: "5px" }} />}
      {texto}
    </button>
  );
}
