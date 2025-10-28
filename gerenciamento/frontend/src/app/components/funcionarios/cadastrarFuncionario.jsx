"use client";
import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css"; // CSS existente

export default function CadastrarFuncionario({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    rg: "",
    data_nascimento: "",
    sexo: "masculino",
    email: "",
    senha: "",
    telefone: "",
    cep: "",
    numero: "",
    bairro: "",
    cidade: "",
    logradouro: "",
    complemento: "",
    uf: "",
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

      if (!response.ok) throw new Error("Erro ao cadastrar funcionário.");

      const resultado = await response.json();
      alert(resultado.message || "Funcionário cadastrado com sucesso!");
      onClose(window.location.reload());

      setForm({
        nome: "",
        cpf: "",
        rg: "",
        data_nascimento: "",
        sexo: "masculino",
        email: "",
        senha: "",
        telefone: "",
        cep: "",
        numero: "",
        bairro: "",
        cidade: "",
        logradouro: "",
        complemento: "",
        uf: "",
        funcao: "",
        salario: "",
        dataContratacao: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar funcionário. Verifique se o servidor está rodando.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo Funcionário</h2>
        <button
          className={styles.botaoCancelar}
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <div className={styles.formGroup}>
          <label htmlFor="nome" className={styles.label}>Nome</label>
          <input
            className={styles.input}
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        {/* CPF e RG */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="cpf" className={styles.label}>CPF</label>
            <input
              className={styles.input}
              id="cpf"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rg" className={styles.label}>RG</label>
            <input
              className={styles.input}
              id="rg"
              name="rg"
              value={form.rg}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Data de Nascimento e Sexo */}
        <div className={styles.formGroup}>
          <label htmlFor="data_nascimento" className={styles.label}>Data de Nascimento</label>
          <input
            className={styles.inputDate}
            id="data_nascimento"
            name="data_nascimento"
            type="date"
            value={form.data_nascimento}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="sexo" className={styles.label}>Sexo</label>
          <select
            className={styles.input}
            id="sexo"
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* Função, Email e Senha */}
        <div className={styles.formGroup}>
          <label htmlFor="funcao" className={styles.label}>Função</label>
          <input
            className={styles.input}
            id="funcao"
            name="funcao"
            value={form.funcao}
            onChange={handleChange}
            required
          />
        </div>
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
        <div className={styles.formGroup}>
          <label htmlFor="senha" className={styles.label}>Senha</label>
          <input
            className={styles.input}
            id="senha"
            name="senha"
            type="password"
            value={form.senha}
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
            value={form.telefone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Endereço */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="cep" className={styles.label}>CEP</label>
            <input
              className={styles.input}
              id="cep"
              name="cep"
              value={form.cep}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="numero" className={styles.label}>Número</label>
            <input
              className={styles.input}
              id="numero"
              name="numero"
              value={form.numero}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="bairro" className={styles.label}>Bairro</label>
            <input
              className={styles.input}
              id="bairro"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cidade" className={styles.label}>Cidade</label>
            <input
              className={styles.input}
              id="cidade"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="logradouro" className={styles.label}>Logradouro</label>
          <input
            className={styles.input}
            id="logradouro"
            name="logradouro"
            value={form.logradouro}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="complemento" className={styles.label}>Complemento</label>
          <input
            className={styles.input}
            id="complemento"
            name="complemento"
            value={form.complemento}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="uf" className={styles.label}>UF</label>
          <input
            className={styles.input}
            id="uf"
            name="uf"
            value={form.uf}
            onChange={handleChange}
            maxLength={2}
          />
        </div>

        {/* Salário e Data de Contratação */}
        <div className={styles.formGroup}>
          <label htmlFor="salario" className={styles.label}>Salário</label>
          <input
            className={styles.input}
            id="salario"
            name="salario"
            type="number"
            step="0.01"
            value={form.salario}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dataContratacao" className={styles.label}>Data de Contratação</label>
          <input
            className={styles.inputDate}
            id="dataContratacao"
            name="dataContratacao"
            type="date"
            value={form.dataContratacao}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.botaoEnviar} disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar funcionário"}
        </button>
      </form>
    </div>
  );
}