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
  async function handleDelete() {
    try {
      const response = await fetch(
        `http://localhost:5000/deletar_cliente/${clienteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar cliente");

      alert("Cliente deletado com sucesso!");
      onDelete(); // atualiza os dados no componente pai
      onClose(); // fecha o popup
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar cliente.");
    }
  }
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
            onClick={handleDelete}
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
