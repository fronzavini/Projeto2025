import { useState } from "react";
import styles from "../../styles/perfis.module.css";

export default function CadastrarPerfil({ onClose, onCreate }) {
  const [form, setForm] = useState({
    nome: "",
    permissoes: "",
    ativo: true,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Chama callback de criar para atualizar lista no pai
    onCreate && onCreate(form);
    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Novo Perfil</h2>
          <button onClick={onClose}>Fechar</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Permissões</label>
            <textarea
              name="permissoes"
              rows={3}
              value={form.permissoes}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              name="ativo"
              value={form.ativo ? "ativo" : "inativo"}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  ativo: e.target.value === "ativo",
                }))
              }
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.botaoCancelar}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.botaoSalvar}>
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
