import styles from "../styles/DeletarCliente.module.css";

type DeletarProdutoProps = {
  onClose: () => void;
  onDelete: () => void;
  produtoId: string;
};

export default function DeletarProduto({
  onClose,
  onDelete,
  produtoId,
}: DeletarProdutoProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Excluir Produto</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <p>
            Tem certeza que deseja deletar o produto com ID{" "}
            <strong>{produtoId}</strong>?
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
