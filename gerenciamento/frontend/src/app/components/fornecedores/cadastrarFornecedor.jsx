import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarFornecedor({ onClose }) {
  const [form, setForm] = useState({
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
    endMunicipio: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/criar_fornecedor", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar fornecedor.");

      alert("Fornecedor cadastrado com sucesso!");
      onClose();

      // limpar formulário
      setForm({
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
        endMunicipio: "",
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
        <button className={styles.botaoCancelar} type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <div className={styles.formGroup}>
          <label htmlFor="nome_empresa" className={styles.label}>Nome da empresa</label>
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

        {/* CNPJ */}
        <div className={styles.formGroup}>
          <label htmlFor="cnpj" className={styles.label}>CNPJ</label>
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

        {/* Telefone */}
        <div className={styles.formGroup}>
          <label htmlFor="telefone" className={styles.label}>Telefone</label>
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

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
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

        {/* CEP + Número */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="endCep" className={styles.label}>CEP</label>
            <input
              className={styles.input}
              id="endCep"
              name="endCep"
              type="text"
              value={form.endCep}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endNumero" className={styles.label}>Número</label>
            <input
              className={styles.input}
              id="endNumero"
              name="endNumero"
              type="text"
              value={form.endNumero}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Rua */}
        <div className={styles.formGroup}>
          <label htmlFor="endRua" className={styles.label}>Rua</label>
          <input
            className={styles.input}
            id="endRua"
            name="endRua"
            type="text"
            value={form.endRua}
            onChange={handleChange}
          />
        </div>

        {/* Bairro / Complemento / UF */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="endBairro" className={styles.label}>Bairro</label>
            <input
              className={styles.input}
              id="endBairro"
              name="endBairro"
              type="text"
              value={form.endBairro}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endComplemento" className={styles.label}>Complemento</label>
            <input
              className={styles.input}
              id="endComplemento"
              name="endComplemento"
              type="text"
              value={form.endComplemento}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endUF" className={styles.label}>UF</label>
            <input
              className={styles.input}
              id="endUF"
              name="endUF"
              type="text"
              maxLength={2}
              value={form.endUF}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Município */}
        <div className={styles.formGroup}>
          <label htmlFor="endMunicipio" className={styles.label}>Município</label>
          <input
            className={styles.input}
            id="endMunicipio"
            name="endMunicipio"
            type="text"
            value={form.endMunicipio}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.botaoEnviar}>
          Cadastrar fornecedor
        </button>
      </form>
    </div>
  );
}
