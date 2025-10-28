import React from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarFornecedor({ onClose, fornecedor }) {
  if (!fornecedor) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>
              Fornecedor: {fornecedor.id || ""}
            </h2>
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
              <label htmlFor="nome_empresa" className={styles.label}>
                Nome da empresa
              </label>
              <input
                className={styles.input}
                id="nome_empresa"
                name="nome_empresa"
                type="text"
                value={fornecedor.nome_empresa || ""}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cnpj" className={styles.label}>
                CNPJ
              </label>
              <input
                className={styles.input}
                id="cnpj"
                name="cnpj"
                type="text"
                value={fornecedor.cnpj || ""}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefone" className={styles.label}>
                Telefone
              </label>
              <input
                className={styles.input}
                id="telefone"
                name="telefone"
                type="text"
                value={fornecedor.telefone || ""}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                value={fornecedor.email || ""}
                disabled
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="cep" className={styles.label}>
                  CEP
                </label>
                <input
                  className={styles.input}
                  id="cep"
                  name="cep"
                  type="text"
                  value={fornecedor.cep || ""}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="numero" className={styles.label}>
                  Número
                </label>
                <input
                  className={styles.input}
                  id="numero"
                  name="numero"
                  type="text"
                  value={fornecedor.numero || ""}
                  disabled
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="bairro" className={styles.label}>
                  Bairro
                </label>
                <input
                  className={styles.input}
                  id="bairro"
                  name="bairro"
                  type="text"
                  value={fornecedor.bairro || ""}
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="complemento" className={styles.label}>
                  Complemento
                </label>
                <input
                  className={styles.input}
                  id="complemento"
                  name="complemento"
                  type="text"
                  value={fornecedor.complemento || ""}
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="uf" className={styles.label}>
                  UF
                </label>
                <input
                  className={styles.input}
                  id="uf"
                  name="uf"
                  type="text"
                  value={fornecedor.uf || ""}
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
