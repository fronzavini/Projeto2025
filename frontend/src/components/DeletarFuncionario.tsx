import styles from "../styles/DeletarCliente.module.css";

type DeletarFuncionarioProps = {
  onClose: () => void;
  onDelete: () => void;
  funcionarioId: string;
};

export default function DeletarFuncionario({
  onClose,
  onDelete,
  funcionarioId,
}: DeletarFuncionarioProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Excluir Funcionario</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <p>
            Tem certeza que deseja deletar o funcionario com ID{" "}
            <strong>{funcionarioId}</strong>?
          </p>
          <button
            type="button"
            className={styles.botaoDeletar}
            onClick={onDelete}
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
