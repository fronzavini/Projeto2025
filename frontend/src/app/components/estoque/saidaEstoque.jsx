import styles from "../../styles/entregue.module.css"; // mesmo style do ConfirmarEncomenda

export default function SaidaEstoque({ onClose, estoqueId }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Registrar Saída</h2>
        <p>
          Defina a quantidade de saída para o produto{" "}
          <strong>#{estoqueId}</strong>:
        </p>

        <input
          type="number"
          min="1"
          defaultValue="1"
          className={styles.input}
          style={{ width: "100%", margin: "10px 0", padding: "8px" }}
        />

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.confirm} onClick={onClose}>
            Registrar saída
          </button>
        </div>
      </div>
    </div>
  );
}
