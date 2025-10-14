import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarCupom({ onClose, cupom }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Cupom: {cupom.id}</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <form>
            {/* Nome */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do cupom</label>
              <input
                className={styles.input}
                type="text"
                value={cupom.nome}
                disabled
              />
            </div>

            {/* Tipo */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de desconto</label>
              <input
                className={styles.input}
                type="text"
                value={cupom.tipo}
                disabled
              />
            </div>

            {/* Valores */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Valor do desconto</label>
                <input
                  className={styles.input}
                  type="number"
                  value={cupom.valorDesconto}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Valor máximo de desconto</label>
                <input
                  className={styles.input}
                  type="number"
                  value={cupom.valorMaximoDesconto}
                  disabled
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Valor mínimo da compra</label>
              <input
                className={styles.input}
                type="number"
                value={cupom.valorMinimoCompra}
                disabled
              />
            </div>

            {/* Categoria */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Categoria</label>
              <input
                className={styles.input}
                type="text"
                value={cupom.categoria}
                disabled
              />
            </div>

            {/* Datas */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Data de início</label>
                <input
                  className={styles.input}
                  type="date"
                  value={cupom.dataInicio}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Data de fim</label>
                <input
                  className={styles.input}
                  type="date"
                  value={cupom.dataTermino}
                  disabled
                />
              </div>
            </div>

            {/* Descrição */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Descrição</label>
              <textarea
                className={styles.input}
                value={cupom.descricao}
                disabled
              />
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <input
                className={styles.input}
                type="text"
                value={cupom.status}
                disabled
              />
            </div>

            {/* Usos */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Usos permitidos</label>
                <input
                  className={styles.input}
                  type="number"
                  value={cupom.usos_permitidos}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Usos realizados</label>
                <input
                  className={styles.input}
                  type="number"
                  value={cupom.usos_realizados}
                  disabled
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}