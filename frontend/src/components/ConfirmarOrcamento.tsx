import styles from "../styles/Entregue.module.css";

type EntregueProps = {
  onClose: () => void;
  onConfirm: () => void;
  pedidoId?: string;
};

export default function ConfirmarOrcamento({
  onClose,
  onConfirm,
  pedidoId,
}: EntregueProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Aceitar Orçamento</h2>
        <p>
          Tem certeza que deseja marcar o orçamento <strong>#{pedidoId}</strong>{" "}
          como aceito?
        </p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.confirm}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
