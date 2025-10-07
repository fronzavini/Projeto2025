"use client";
import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarFornecedor({ fornecedor, onClose, onSuccess }) {
  const [form, setForm] = useState({ ...fornecedor });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        `http://localhost:5000/editar_fornecedor/${fornecedor.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!resp.ok) throw new Error();
      alert("Fornecedor atualizado com sucesso!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch {
      alert("Erro ao editar fornecedor.");
    }
  };

  return (
    <div className={styles.modal}>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <h2>Editar Fornecedor</h2>
        <input
          name="nome_empresa"
          placeholder="Nome da Empresa"
          value={form.nome_empresa}
          onChange={handleChange}
          required
        />
        <input
          name="cnpj"
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={handleChange}
          required
        />
        <input
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="cep"
          placeholder="CEP"
          value={form.cep}
          onChange={handleChange}
        />
        <input
          name="logradouro"
          placeholder="Rua"
          value={form.logradouro}
          onChange={handleChange}
        />
        <input
          name="numero"
          placeholder="Número"
          value={form.numero}
          onChange={handleChange}
        />
        <input
          name="bairro"
          placeholder="Bairro"
          value={form.bairro}
          onChange={handleChange}
        />
        <input
          name="complemento"
          placeholder="Complemento"
          value={form.complemento}
          onChange={handleChange}
        />
        <input
          name="uf"
          placeholder="UF"
          value={form.uf}
          onChange={handleChange}
        />
        <input
          name="cidade"
          placeholder="Cidade"
          value={form.cidade}
          onChange={handleChange}
        />
        <div className={styles.botoes}>
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}