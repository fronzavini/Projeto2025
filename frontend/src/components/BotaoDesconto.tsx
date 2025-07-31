import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/botao.module.css";

type BotaoDescontoProps = {
  onClick: () => void;
};

export default function BotaoDesconto({ onClick }: BotaoDescontoProps) {
  return (
    <button className={styles.botao} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} /> Cadastrar Desconto
    </button>
  );
}
