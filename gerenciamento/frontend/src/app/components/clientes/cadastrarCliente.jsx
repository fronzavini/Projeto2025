import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";
import axios from "axios";

export default function CadastrarCliente({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "fisico",
    sexo: "",
    cpf: "",
    cnpj: "",
    rg: "",
    email: "",
    telefone: "",
    dataNasc: "",
    endCep: "",
    endNumero: "",
    endMunicipio: "",
    endBairro: "",
    endRua: "",
    endComplemento: "",
    endUF: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dadosCompletos = {
      ...form,
      cnpj: form.tipo === "juridico" ? form.cpf : "", // usa o campo do CPF como entrada do CNPJ
      cpf: form.tipo === "fisico" ? form.cpf : "",
      dataCadastro: new Date().toISOString().split("T")[0],
      estado: true,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/criar_cliente", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCompletos),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar cliente.");

      alert("Cliente cadastrado com sucesso!");
      onClose();

      setForm({
        nome: "",
        tipo: "fisico",
        sexo: "",
        cpf: "",
        cnpj: "",
        rg: "",
        email: "",
        telefone: "",
        dataNasc: "",
        endCep: "",
        endNumero: "",
        endMunicipio: "",
        endBairro: "",
        endRua: "",
        endComplemento: "",
        endUF: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar cliente.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo cliente</h2>
        <button className={styles.botaoCancelar} type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <div className={styles.formGroup}>
          <label htmlFor="nome" className={styles.label}>Nome do cliente</label>
          <input
            className={styles.input}
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tipo */}
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="tipo"
              value="fisico"
              checked={form.tipo === "fisico"}
              onChange={handleChange}
              className={styles.radioInput}
            />
            Físico
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="tipo"
              value="juridico"
              checked={form.tipo === "juridico"}
              onChange={handleChange}
              className={styles.radioInput}
            />
            Jurídico
          </label>
        </div>

        {/* Sexo */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Sexo</label>
          <select
            name="sexo"
            className={styles.input}
            value={form.sexo}
            onChange={handleChange}
            disabled={form.tipo !== "fisico"}
            required={form.tipo === "fisico"}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* CPF e RG */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="cpf" className={styles.label}>
              {form.tipo === "fisico" ? "CPF" : "CNPJ"}
            </label>
            <input
              className={styles.input}
              id="cpf"
              name="cpf"
              type="text"
              value={form.cpf}
              onChange={handleChange}
              required
            />
          </div>

          {form.tipo === "fisico" && (
            <div className={styles.formGroup}>
              <label htmlFor="rg" className={styles.label}>RG</label>
              <input
                className={styles.input}
                id="rg"
                name="rg"
                type="text"
                value={form.rg}
                onChange={handleChange}
                required
              />
            </div>
          )}
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

        {/* Data de nascimento */}
        <div className={styles.formGroup}>
          <label htmlFor="dataNasc" className={styles.label}>Data de nascimento</label>
          <input
            className={styles.inputDate}
            id="dataNasc"
            name="dataNasc"
            type="date"
            value={form.dataNasc}
            onChange={handleChange}
            disabled={form.tipo !== "fisico"}
            required={form.tipo === "fisico"}
          />
        </div>

        {/* CEP e número */}
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
              required
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
              required
            />
          </div>
        </div>

        {/* UF */}
        <div className={styles.formGroup}>
          <label htmlFor="endUF" className={styles.label}>UF</label>
          <input
            className={styles.input}
            id="endUF"
            name="endUF"
            type="text"
            value={form.endUF}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cidade e bairro */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="endMunicipio" className={styles.label}>Cidade</label>
            <input
              className={styles.input}
              id="endMunicipio"
              name="endMunicipio"
              type="text"
              value={form.endMunicipio}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endBairro" className={styles.label}>Bairro</label>
            <input
              className={styles.input}
              id="endBairro"
              name="endBairro"
              type="text"
              value={form.endBairro}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Rua */}
        <div className={styles.formGroup}>
          <label htmlFor="endRua" className={styles.label}>Logradouro</label>
          <input
            className={styles.input}
            id="endRua"
            name="endRua"
            type="text"
            value={form.endRua}
            onChange={handleChange}
            required
          />
        </div>

        {/* Complemento */}
        <div className={styles.formGroup}>
          <label htmlFor="endComplemento" className={styles.label}>Complemento</label>
          <input
            className={styles.input}
            id="endComplemento"
            name="endComplemento"
            type="text"
            value={form.endComplemento}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.botaoEnviar}>
          Cadastrar cliente
        </button>
      </form>
    </div>
  );
}
