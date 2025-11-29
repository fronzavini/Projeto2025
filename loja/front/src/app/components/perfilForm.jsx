// components/PerfilForm.js
"use client";
import { useState, useEffect } from "react";
import styles from "../styles/perfil.module.css";

export default function PerfilForm({ usuario }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "fisico",
    cpf: "",
    rg: "",
    email: "",
    telefone: "",
    dataNascimento: "",
  });

  useEffect(() => {
    if (usuario) {
      setForm((prev) => ({
        ...prev,
        nome: usuario.nome ?? "",
        tipo: usuario.tipo ?? "fisico",
        cpf: usuario.cpf ?? "",
        rg: usuario.rg ?? "",
        email: usuario.email ?? "",
        telefone: usuario.telefone ?? "",
        dataNascimento: usuario.dataNascimento ?? "",
      }));
    }
  }, [usuario]);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados atualizados:", form);
    alert("Informações atualizadas!");
  };

  return (
    <div className={styles.perfilForm}>
      <h2>Meus Dados</h2>

      <form onSubmit={handleSubmit}>
        {/* --- COLUNA 1 + 2 --- */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>

          <div className={styles.col}>
            <label>Tipo de Pessoa</label>
            <select
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
            >
              <option value="fisico">Pessoa Física</option>
              <option value="juridico">Pessoa Jurídica</option>
            </select>
          </div>
        </div>

        {/* --- COLUNA 1 + 2 --- */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>CPF</label>
            <input
              type="text"
              value={form.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
            />
          </div>

          <div className={styles.col}>
            <label>RG</label>
            <input
              type="text"
              value={form.rg}
              onChange={(e) => handleChange("rg", e.target.value)}
            />
          </div>
        </div>

        {/* --- COLUNA 1 + 2 --- */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className={styles.col}>
            <label>Telefone</label>
            <input
              type="text"
              value={form.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
            />
          </div>
        </div>

        {/* --- COLUNA 1 --- */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>Data de Nascimento</label>
            <input
              type="date"
              value={form.dataNascimento}
              onChange={(e) => handleChange("dataNascimento", e.target.value)}
            />
          </div>

          <div className={styles.col}></div>
        </div>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
