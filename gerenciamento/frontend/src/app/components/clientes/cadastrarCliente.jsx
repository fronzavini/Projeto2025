import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";
import axios from "axios";

export default function CadastrarCliente({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "fisico",
    cpf: "",
    rg: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    cep: "",
    numero: "",
    cidade: "",
    bairro: "",
    logradouro: "",
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
      data_nascimento: form.dataNascimento,
      /*cidade: form.cidade,*/
      cnpj: form.tipo === "juridico" ? form.cpf : "",
      senha: "cliente123",
      /*uf: form.uf,*/
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
      /*const response = await axios.post(
        "http://127.0.0.1:5000/criar_cliente",
        dadosCompletos
      );*/

      if (!response.ok) throw new Error("Erro ao cadastrar cliente.");

      alert("Cliente cadastrado com sucesso!");
      onClose(window.location.reload());

      setForm({
        nome: "",
        tipo: "fisico",
        cpf: "",
        rg: "",
        email: "",
        telefone: "",
        dataNascimento: "",
        cep: "",
        numero: "",
        cidade: "",
        bairro: "",
        logradouro: "",
        complemento: "",
        uf: "",
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
          <label htmlFor="nome" className={styles.label}>
            Nome do cliente
          </label>
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

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="cpf" className={styles.label}>
              CPF
            </label>
            <input
              className={styles.input}
              id="cpf"
              name="cpf"
              type="text"
              value={form.cpf}
              onChange={handleChange}
              disabled={form.tipo !== "fisico"}
              required={form.tipo === "fisico"}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rg" className={styles.label}>
              RG
            </label>
            <input
              className={styles.input}
              id="rg"
              name="rg"
              type="text"
              value={form.rg}
              onChange={handleChange}
              disabled={form.tipo !== "fisico"}
              required={form.tipo === "fisico"}
            />
          </div>
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
          <label htmlFor="dataNascimento" className={styles.label}>
            Data de nascimento
          </label>
          <input
            className={styles.inputDate}
            id="dataNascimento"
            name="dataNascimento"
            type="date"
            value={form.dataNascimento}
            onChange={handleChange}
            disabled={form.tipo !== "fisico"}
            required={form.tipo === "fisico"}
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

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="uf" className={styles.label}>
              UF
            </label>
            <input
              className={styles.input}
              id="uf"
              name="uf"
              type="text"
              value={form.uf}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="cidade" className={styles.label}>
              Cidade
            </label>
            <input
              className={styles.input}
              id="cidade"
              name="cidade"
              type="text"
              value={form.cidade}
              onChange={handleChange}
            />
          </div>

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

        <button type="submit" className={styles.botaoEnviar}>
          Cadastrar cliente
        </button>
      </form>
    </div>
  );
}