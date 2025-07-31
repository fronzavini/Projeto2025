import styles from "../styles/Entregue.module.css"; // mesmo CSS para manter padrão

type CancelarProps = {
  onClose: () => void;
  onConfirm: () => void;
  descontoId?: number;
};

export default function CancelarDesconto({
  onClose,
  onConfirm,
  descontoId,
}: CancelarProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Cancelar Desconto</h2>
        <p>
          Tem certeza que deseja <strong>cancelar</strong> o desconto{" "}
          <strong>#{descontoId}</strong>?
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
            Cancelar Desconto
          </button>
        </div>
      </div>
    </div>
  );
}
