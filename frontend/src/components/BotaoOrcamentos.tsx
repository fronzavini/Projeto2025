import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/botao.module.css";

type BotaoOrcamentoProps = {
  onClick: () => void;
};

export default function BotaoOrcamento({ onClick }: BotaoOrcamentoProps) {
  return (
    <button className={styles.botao} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} /> Novo orçamento
    </button>
  );
}
