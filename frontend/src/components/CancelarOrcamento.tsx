import styles from "../styles/Entregue.module.css"; // mesmo CSS para manter padrão

type CancelarProps = {
  onClose: () => void;
  onConfirm: () => void;
  pedidoId?: string;
};

export default function CancelarOrcamento({
  onClose,
  onConfirm,
  pedidoId,
}: CancelarProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Cancelar Orçamento</h2>
        <p>
          Tem certeza que deseja <strong>cancelar</strong> o orçamento{" "}
          <strong>#{pedidoId}</strong>?
        </p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Voltar
          </button>
          <button
            className={styles.confirm}
            style={{ backgroundColor: "#e53935" }} // vermelho para cancelar
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Cancelar Orçamento
          </button>
        </div>
      </div>
    </div>
  );
}
