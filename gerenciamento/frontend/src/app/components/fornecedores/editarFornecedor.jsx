import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarFornecedor({ onClose, fornecedor }) {
  const [formData, setFormData] = useState(fornecedor);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por enquanto só loga localmente e fecha modal
    console.log("Dados atualizados (local):", formData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>
              Editar Fornecedor: {fornecedor.id}
            </h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="nome_empresa" className={styles.label}>
                Nome da empresa
              </label>
              <input
                className={styles.input}
                id="nome_empresa"
                name="nome_empresa"
                type="text"
                value={formData.nome_empresa}
                onChange={handleChange}
                required
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
                value={formData.cnpj}
                onChange={handleChange}
                required
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
                value={formData.telefone}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
                  value={formData.cep}
                  onChange={handleChange}
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
                  value={formData.numero}
                  onChange={handleChange}
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
                  value={formData.bairro}
                  onChange={handleChange}
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
                  value={formData.complemento}
                  onChange={handleChange}
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
                  maxLength={2}
                  value={formData.uf}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className={styles.botaoEnviar}>
              Salvar alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}