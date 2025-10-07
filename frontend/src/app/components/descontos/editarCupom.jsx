"use client";
import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarCupom({ cupom, onClose, onSuccess }) {
  const [form, setForm] = useState({ ...cupom });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        `http://localhost:5000/editar_cupom/${cupom.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!resp.ok) throw new Error();
      alert("Cupom atualizado com sucesso!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch {
      alert("Erro ao editar cupom.");
    }
  };

  return (
    <div className={styles.modal}>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <h2>Editar Cupom</h2>
        <input
          name="codigo"
          placeholder="Código"
          value={form.codigo}
          onChange={handleChange}
          required
        />
        <input
          name="tipo"
          placeholder="Tipo (fixo/percentual/frete)"
          value={form.tipo}
          onChange={handleChange}
          required
        />
        <input
          name="descontofixo"
          placeholder="Desconto Fixo"
          value={form.descontofixo}
          onChange={handleChange}
        />
        <input
          name="descontoPorcentagem"
          placeholder="Desconto %"
          value={form.descontoPorcentagem}
          onChange={handleChange}
        />
        <input
          name="descontofrete"
          placeholder="Desconto Frete"
          value={form.descontofrete}
          onChange={handleChange}
        />
        <input
          name="validade"
          placeholder="Validade (YYYY-MM-DD)"
          value={form.validade}
          onChange={handleChange}
        />
        <input
          name="usos_permitidos"
          placeholder="Usos Permitidos"
          value={form.usos_permitidos}
          onChange={handleChange}
        />
        <input
          name="valor_minimo"
          placeholder="Valor Mínimo"
          value={form.valor_minimo}
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