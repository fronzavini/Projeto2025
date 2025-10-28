import React from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarDesconto({ desconto, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Desconto: {desconto.codigo}</h2>
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
              <label htmlFor="codigo" className={styles.label}>
                Código do Desconto
              </label>
              <input
                className={styles.input}
                id="codigo"
                name="codigo"
                type="text"
                value={desconto.codigo}
                disabled
              />
            </div>

            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="fixo"
                  checked={desconto.tipo === "fixo"}
                  className={styles.radioInput}
                  disabled
                />
                Fixo
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="porcentagem"
                  checked={desconto.tipo === "porcentagem"}
                  className={styles.radioInput}
                  disabled
                />
                Porcentagem
              </label>
            </div>

            {desconto.tipo === "fixo" && (
              <div className={styles.formGroup}>
                <label htmlFor="descontoFixo" className={styles.label}>
                  Valor do Desconto (R$)
                </label>
                <input
                  className={styles.input}
                  id="descontoFixo"
                  name="descontoFixo"
                  type="text"
                  value={desconto.descontoFixo}
                  disabled
                />
              </div>
            )}

            {desconto.tipo === "porcentagem" && (
              <div className={styles.formGroup}>
                <label htmlFor="descontoPorcentagem" className={styles.label}>
                  Desconto (%)
                </label>
                <input
                  className={styles.input}
                  id="descontoPorcentagem"
                  name="descontoPorcentagem"
                  type="text"
                  value={desconto.descontoPorcentagem}
                  disabled
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="validade" className={styles.label}>
                Validade
              </label>
              <input
                className={styles.input}
                id="validade"
                name="validade"
                type="text"
                value={desconto.validade}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="produto" className={styles.label}>
                Produto
              </label>
              <input
                className={styles.input}
                id="produto"
                name="produto"
                type="text"
                value={desconto.produto}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="estado" className={styles.label}>
                Estado
              </label>
              <input
                className={styles.input}
                id="estado"
                name="estado"
                type="text"
                value={desconto.estado}
                disabled
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
