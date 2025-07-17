import styles from "../styles/Estoque.module.css";

type SaidaEstoqueProps = {
  onClose: () => void;
  estoqueId: string;
};

export default function SaidaEstoque({
  onClose,
  estoqueId,
}: SaidaEstoqueProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Produto #{estoqueId}</h2>
            <p className={styles.subtitulo}>Ajustar quantidade</p>
          </div>

          <label htmlFor="saida" className={styles.label}>
            Quantidade de saída
          </label>
          <input
            className={styles.input}
            id="saida"
            name="saida"
            type="text"
            defaultValue="1"
          />

          <div className={styles.botoes}>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={styles.botaoEstoque}
              onClick={onClose}
            >
              Registrar saída
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
