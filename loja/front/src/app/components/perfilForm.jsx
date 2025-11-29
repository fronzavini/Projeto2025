// components/PerfilForm.js
"use client";
import { useState, useEffect } from "react";
import styles from "../styles/perfil.module.css";

export default function PerfilForm({ usuario }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  useEffect(() => {
    if (usuario) setForm(usuario);
  }, [usuario]);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você chamaria sua API Python para atualizar os dados
    console.log("Dados atualizados:", form);
    alert("Informações atualizadas!");
  };

  return (
    <div className={styles.perfilForm}>
      <h2>Meus Dados</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome</label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <label>Telefone</label>
        <input
          type="text"
          value={form.telefone}
          onChange={(e) => handleChange("telefone", e.target.value)}
        />

        <label>Endereço</label>
        <input
          type="text"
          value={form.endereco}
          onChange={(e) => handleChange("endereco", e.target.value)}
        />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
