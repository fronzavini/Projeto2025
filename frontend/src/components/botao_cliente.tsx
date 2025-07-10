import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Botao_cliente() {
  return (
    <button>
      <FontAwesomeIcon icon={faPlus} /> Cadastrar Cliente
    </button>
  );
}
