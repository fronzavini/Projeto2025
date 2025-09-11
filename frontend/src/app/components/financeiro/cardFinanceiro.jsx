import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/cardFinanceiro.module.css";

export default function CardFinanceiro() {
  return (
    <div>
      <div className={styles.resumo}>
        <div className={styles.card}>
          <div className={styles.icone}>
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className={styles.texto}>
            <span className={styles.descricao}>Total</span>
            <span className={styles.valor}>R$ 12.500</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icone}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className={styles.texto}>
            <span className={styles.descricao}>Entradas</span>
            <span className={styles.valor}>R$ 8.200</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icone}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </div>
          <div className={styles.texto}>
            <span className={styles.descricao}>Saídas</span>
            <span className={styles.valor}>R$ 4.300</span>
          </div>
        </div>
      </div>
    </div>
  );
}
