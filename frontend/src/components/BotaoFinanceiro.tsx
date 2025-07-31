import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/botao.module.css";

type BotaoFinanceiroProps = {
  onClick: () => void;
};

export default function BotaoFinanceiro({ onClick }: BotaoFinanceiroProps) {
  return (
    <button className={styles.botao} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} /> Cadastrar Movimentação
    </button>
  );
}
