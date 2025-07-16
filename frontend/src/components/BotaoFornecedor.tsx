import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/botao.module.css";

type BotaoFornecedorProps = {
  onClick: () => void;
};

export default function BotaoFornecedor({ onClick }: BotaoFornecedorProps) {
  return (
    <button className={styles.botao} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} /> Cadastrar Fornecedor
    </button>
  );
}
