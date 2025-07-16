import styles from "../styles/DeletarCliente.module.css";

type DeletarFornecedorProps = {
  onClose: () => void;
  onDelete: () => void;
  fornecedorId: string;
};

export default function DeletarFornecedor({
  onClose,
  onDelete,
  fornecedorId,
}: DeletarFornecedorProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Excluir Fornecedor</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <p>
            Tem certeza que deseja deletar o fornecedor com ID{" "}
            <strong>{fornecedorId}</strong>?
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
