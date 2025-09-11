import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarFornecedor({ onClose }) {
  const [form, setForm] = useState({
    nome_empresa: "",
    cnpj: "",
    telefone: "",
    email: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    complemento: "",
    uf: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dadosCompletos = {
      ...form,
    };

    try {
      const response = await fetch("http://localhost:5000/incluir_fornecedor", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCompletos),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar fornecedor.");

      alert("Fornecedor cadastrado com sucesso!");
      onClose();

      setForm({
        nome_empresa: "",
        cnpj: "",
        telefone: "",
        email: "",
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        complemento: "",
        uf: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar fornecedor.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo fornecedor</h2>
        <button
          className={styles.botaoCancelar}
          type="button"
          onClick={onClose}
        >
          Cancelar
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
            value={form.nome_empresa}
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
            value={form.cnpj}
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
            value={form.telefone}
            onChange={handleChange}
            required
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
            value={form.email}
            onChange={handleChange}
            required
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
              value={form.cep}
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
              value={form.numero}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="logradouro" className={styles.label}>
            Logradouro
          </label>
          <input
            className={styles.input}
            id="logradouro"
            name="logradouro"
            type="text"
            value={form.logradouro}
            onChange={handleChange}
          />
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
              value={form.bairro}
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
              value={form.complemento}
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
              value={form.uf}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.botaoEnviar}>
          Cadastrar fornecedor
        </button>
      </form>
    </div>
  );
}
