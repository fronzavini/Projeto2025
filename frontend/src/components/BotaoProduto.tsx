import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/botao.module.css";

type BotaoProdutoProps = {
  onClick: () => void;
};

export default function BotaoProduto({ onClick }: BotaoProdutoProps) {
  return (
    <button className={styles.botao} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} /> Cadastrar Produto
    </button>
  );
}
