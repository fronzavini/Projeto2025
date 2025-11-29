"use client";
import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarFuncionario({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    rg: "",
    data_nascimento: "",
    sexo: "masculino",
    email: "",
    telefone: "",
    endCep: "",
    endRua: "",
    endNumero: "",
    endBairro: "",
    endComplemento: "",
    endUF: "",
    endMunicipio: "",
    funcao: "",
    salario: "",
    dataContratacao: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const dadosCompletos = { ...form, estado: true };

    try {
      const response = await fetch("http://127.0.0.1:5000/criar_funcionario", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCompletos),
      });

      const resultado = await response.json();
      if (!response.ok) {
        const msg =
          (resultado && resultado.detalhes) ||
          "Erro ao cadastrar funcionário.";
        throw new Error(msg);
      }

      alert("Funcionário cadastrado com sucesso!");
      onClose();

      setForm({
        nome: "",
        cpf: "",
        rg: "",
        data_nascimento: "",
        sexo: "masculino",
        email: "",
        telefone: "",
        endCep: "",
        endRua: "",
        endNumero: "",
        endBairro: "",
        endComplemento: "",
        endUF: "",
        endMunicipio: "",
        funcao: "",
        salario: "",
        dataContratacao: "",
      });
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao cadastrar funcionário. Verifique se o servidor está rodando."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo Funcionário</h2>
        <button className={styles.botaoCancelar} type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome</label>
          <input
            className={styles.input}
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        {/* CPF e RG */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>CPF</label>
            <input
              className={styles.input}
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>RG</label>
            <input
              className={styles.input}
              name="rg"
              value={form.rg}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Data de nascimento */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Data de Nascimento</label>
          <input
            className={styles.inputDate}
            type="date"
            name="data_nascimento"
            value={form.data_nascimento}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sexo */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Sexo</label>
          <select
            className={styles.input}
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* Função */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Função</label>
          <select
            className={styles.input}
            name="funcao"
            value={form.funcao}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma função</option>
            <option value="vendedor">Vendedor</option>
            <option value="estoque">Estoque</option>
          </select>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Telefone */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Telefone</label>
          <input
            className={styles.input}
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Endereço */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>CEP</label>
            <input
              className={styles.input}
              name="endCep"
              value={form.endCep}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Número</label>
            <input
              className={styles.input}
              name="endNumero"
              value={form.endNumero}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Rua</label>
            <input
              className={styles.input}
              name="endRua"
              value={form.endRua}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bairro</label>
            <input
              className={styles.input}
              name="endBairro"
              value={form.endBairro}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Complemento</label>
          <input
            className={styles.input}
            name="endComplemento"
            value={form.endComplemento}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>UF</label>
            <input
              className={styles.input}
              name="endUF"
              value={form.endUF}
              onChange={handleChange}
              maxLength={2}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Município</label>
            <input
              className={styles.input}
              name="endMunicipio"
              value={form.endMunicipio}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Salário */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Salário</label>
          <input
            className={styles.input}
            type="number"
            step="0.01"
            name="salario"
            value={form.salario}
            onChange={handleChange}
          />
        </div>

        {/* Data contratação */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Data de Contratação</label>
          <input
            className={styles.inputDate}
            type="date"
            name="dataContratacao"
            value={form.dataContratacao}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className={styles.botaoEnviar}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar funcionário"}
        </button>
      </form>
    </div>
  );
}
