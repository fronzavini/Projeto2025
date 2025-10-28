import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarFornecedor({ onClose, onSave }) {
  const [fornecedor, setFornecedor] = useState({
    nome_empresa: "",
    cnpj: "",
    telefone: "",
    email: "",
    endCep: "",
    endRua: "",
    endNumero: "",
    endBairro: "",
    endComplemento: "",
    endUF: "",
    endMunicipio: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFornecedor((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const resposta = await fetch("http://localhost:5000/criar_fornecedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedor)
      });

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar fornecedor");
      }

      if (onSave) onSave();
      onClose();
    } catch (erro) {
      console.error(erro);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Cadastrar Fornecedor</h2>
            <button className={styles.botaoCancelar} type="button" onClick={onClose}>
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome da Empresa</label>
              <input
                className={styles.input}
                name="nome_empresa"
                type="text"
                value={fornecedor.nome_empresa}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>CNPJ</label>
              <input
                className={styles.input}
                name="cnpj"
                type="text"
                value={fornecedor.cnpj}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Telefone</label>
              <input
                className={styles.input}
                name="telefone"
                type="text"
                value={fornecedor.telefone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                name="email"
                type="email"
                value={fornecedor.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>CEP</label>
                <input
                  className={styles.input}
                  name="endCep"
                  type="text"
                  value={fornecedor.endCep}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Número</label>
                <input
                  className={styles.input}
                  name="endNumero"
                  type="text"
                  value={fornecedor.endNumero}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Rua</label>
                <input
                  className={styles.input}
                  name="endRua"
                  type="text"
                  value={fornecedor.endRua}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Bairro</label>
                <input
                  className={styles.input}
                  name="endBairro"
                  type="text"
                  value={fornecedor.endBairro}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Complemento</label>
                <input
                  className={styles.input}
                  name="endComplemento"
                  type="text"
                  value={fornecedor.endComplemento}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Município</label>
                <input
                  className={styles.input}
                  name="endMunicipio"
                  type="text"
                  value={fornecedor.endMunicipio}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>UF</label>
                <input
                  className={styles.input}
                  name="endUF"
                  type="text"
                  value={fornecedor.endUF}
                  maxLength="2"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formButtons}>
              <button className={styles.botaoSalvar} type="submit">
                Salvar
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
