import styles from "../../styles/entregue.module.css"; // mesmo style do ConfirmarEncomenda

export default function EntradaEstoque({ onClose, estoqueId }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Registrar Entrada</h2>
        <p>
          Defina a quantidade de entrada para o produto{" "}
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
            Registrar entrada
          </button>
        </div>
      </div>
    </div>
  );
}
