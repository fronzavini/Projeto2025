import styles from "../styles/Entregue.module.css"; // mesmo CSS para manter padrão

type CancelarProps = {
  onClose: () => void;
  onConfirm: () => void;
  cupomId?: number;
};

export default function CancelarCupom({
  onClose,
  onConfirm,
  cupomId,
}: CancelarProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Deletar Cupom</h2>
        <p>
          Tem certeza que deseja <strong>deletar</strong> o cupom{" "}
          <strong>#{cupomId}</strong>?
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
            Deletar Cupom
          </button>
        </div>
      </div>
    </div>
  );
}
