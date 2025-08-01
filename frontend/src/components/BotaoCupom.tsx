import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/botao.module.css";

type BotaoCupomProps = {
  onClick: () => void;
};

export default function BotaoCupom({ onClick }: BotaoCupomProps) {
  return (
    <button className={styles.botao} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} /> Cadastrar Cupom
    </button>
  );
}
