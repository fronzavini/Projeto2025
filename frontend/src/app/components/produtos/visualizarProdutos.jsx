import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarProduto({ onClose, produto }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Produto: {produto.id}</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <form>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome</label>
              <input className={styles.input} value={produto.nome} disabled />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Categoria</label>
              <input
                className={styles.input}
                value={produto.categoria}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Marca</label>
              <input className={styles.input} value={produto.marca} disabled />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Preço</label>
                <input
                  className={styles.input}
                  value={`R$ ${produto.preco.toFixed(2)}`}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Qtd. Estoque</label>
                <input
                  className={styles.input}
                  value={produto.quantidade_estoque}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estoque Mínimo</label>
                <input
                  className={styles.input}
                  value={produto.estoque_minimo}
                  disabled
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Fornecedor ID</label>
              <input
                className={styles.input}
                value={produto.fornecedor_id}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Imagem do Produto</label>
              <img
                src={produto.imagem}
                alt={produto.nome}
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Estado</label>
              <input
                className={styles.input}
                value={produto.estado ? "Ativo" : "Inativo"}
                disabled
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
