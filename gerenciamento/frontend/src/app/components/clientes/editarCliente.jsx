"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarCliente({ cliente, onClose, onSalvar }) {
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
    endUF: "",
    endMunicipio: "",
    endBairro: "",
    endRua: "",
    endComplemento: "",
  });

  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome || "",
        tipo: cliente.tipo || "fisico",
        sexo: cliente.sexo || "",
        cpf: cliente.cpf || "",
        cnpj: cliente.cnpj || "",
        rg: cliente.rg || "",
        email: cliente.email || "",
        telefone: cliente.telefone || "",
        dataNasc: cliente.dataNasc || "",
        endCep: cliente.endCep || "",
        endNumero: cliente.endNumero || "",
        endUF: cliente.endUF || "",
        endMunicipio: cliente.endMunicipio || "",
        endBairro: cliente.endBairro || "",
        endRua: cliente.endRua || "",
        endComplemento: cliente.endComplemento || "",
      });
    }
  }, [cliente]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dados = {
      ...form,
      estado: true,
    };

    try {
      const resp = await fetch("http://127.0.0.1:5000/editar_cliente/" + cliente.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resp.ok) throw new Error("Erro ao editar cliente");

      alert("Cliente atualizado com sucesso!");
      onSalvar();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao editar cliente.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Editar Cliente</h2>
        <button className={styles.botaoCancelar} type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome</label>
          <input
            name="nome"
            className={styles.input}
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

        {/* Sexo */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Sexo</label>
          <select
            name="sexo"
            className={styles.input}
            value={form.sexo}
            onChange={handleChange}
            disabled={form.tipo !== "fisico"}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* CPF / CNPJ */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>CPF</label>
            <input
              name="cpf"
              className={styles.input}
              value={form.cpf}
              onChange={handleChange}
              disabled={form.tipo !== "fisico"}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>CNPJ</label>
            <input
              name="cnpj"
              className={styles.input}
              value={form.cnpj}
              onChange={handleChange}
              disabled={form.tipo !== "juridico"}
            />
          </div>
        </div>

        {/* RG */}
        <div className={styles.formGroup}>
          <label className={styles.label}>RG</label>
          <input
            name="rg"
            className={styles.input}
            value={form.rg}
            onChange={handleChange}
            disabled={form.tipo !== "fisico"}
          />
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            name="email"
            className={styles.input}
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Telefone */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Telefone</label>
          <input
            name="telefone"
            className={styles.input}
            value={form.telefone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Data de nascimento */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Data de nascimento</label>
          <input
            name="dataNasc"
            className={styles.inputDate}
            type="date"
            value={form.dataNasc}
            onChange={handleChange}
            disabled={form.tipo !== "fisico"}
          />
        </div>

        {/* Endereço */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>CEP</label>
            <input
              name="endCep"
              className={styles.input}
              value={form.endCep}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Número</label>
            <input
              name="endNumero"
              className={styles.input}
              value={form.endNumero}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>UF</label>
          <input
            name="endUF"
            className={styles.input}
            maxLength={2}
            value={form.endUF}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Município</label>
          <input
            name="endMunicipio"
            className={styles.input}
            value={form.endMunicipio}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Bairro</label>
          <input
            name="endBairro"
            className={styles.input}
            value={form.endBairro}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Rua</label>
          <input
            name="endRua"
            className={styles.input}
            value={form.endRua}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Complemento</label>
          <input
            name="endComplemento"
            className={styles.input}
            value={form.endComplemento}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.botaoEnviar}>
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
