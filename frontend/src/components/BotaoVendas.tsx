import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/botao.module.css";

type BotaoVendaProps = {
  onClick: () => void;
};

export default function BotaoVenda({ onClick }: BotaoVendaProps) {
  return (
    <button className={styles.botao} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} /> Nova venda
    </button>
  );
}
