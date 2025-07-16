import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/botao.module.css";

type BotaoFuncionarioProps = {
  onClick: () => void;
};

export default function BotaoFuncionario({ onClick }: BotaoFuncionarioProps) {
  return (
    <button className={styles.botao} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} /> Cadastrar Funcionário
    </button>
  );
}
