import styles from "../styles/DeletarCliente.module.css";

type DeletarClienteProps = {
  onClose: () => void;
  onDelete: () => void;
  clienteId: string;
};

export default function DeletarCliente({
  onClose,
  onDelete,
  clienteId,
}: DeletarClienteProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Excluir Cliente</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <p>
            Tem certeza que deseja deletar o cliente com ID{" "}
            <strong>{clienteId}</strong>?
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
