"use client";
import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarFinanceiro({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    tipo: "",
    categoria: "",
    descricao: "",
    valor: "",
    data: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch("http://localhost:5000/criar_transacaofinanceira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) throw new Error();
      alert("Transação cadastrada com sucesso!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch {
      alert("Erro ao cadastrar transação.");
    }
  };

  return (
    <div className={styles.modal}>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <h2>Cadastrar Transação Financeira</h2>
        <input name="tipo" placeholder="Tipo (entrada/saída)" value={form.tipo} onChange={handleChange} required />
        <input name="categoria" placeholder="Categoria" value={form.categoria} onChange={handleChange} required />
        <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
        <input name="valor" placeholder="Valor" value={form.valor} onChange={handleChange} required />
        <input name="data" placeholder="Data (YYYY-MM-DD)" value={form.data} onChange={handleChange} required />
        <div className={styles.botoes}>
          <button type="submit">Cadastrar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}