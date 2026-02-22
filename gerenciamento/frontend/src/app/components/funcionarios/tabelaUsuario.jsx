"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/tabelas.module.css";

const API = "http://191.52.6.89:5000";

export default function TabelaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Carregar usuários
  const carregarUsuarios = async () => {
    try {
      const res = await fetch(`${API}/listar_usuarios_sistema`);
      if (!res.ok) throw new Error("Erro ao carregar usuários");
      const data = await res.json();
      setUsuarios(
        (data || []).map((u) => ({
          id: u.id,
          usuario: u.usuario,
          tipo_usuario: u.tipo_usuario,
          tema_preferido: u.tema_preferido || "claro",
        }))
      );
    } catch (err) {
      console.error(err);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Excluir
  const handleDeletar = async (id) => {
    if (!confirm("Deseja realmente deletar este usuário?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${API}/deletar_usuario_sistema/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar usuário");
      alert("Usuário deletado com sucesso!");
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar usuário.");
    } finally {
      setLoading(false);
    }
  };

  // Editar
  const handleEditar = (usuario) => setEditando({ ...usuario });

  // Salvar
  const salvarEdicao = async () => {
    try {
      setSalvando(true);
      const res = await fetch(`${API}/editar_usuario_sistema/${editando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          tipo_usuario: editando.tipo_usuario,
          tema_preferido: editando.tema_preferido,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.message || data?.detalhes || "Erro ao salvar");

      alert("Usuário atualizado com sucesso!");
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editando.id ? { ...u, ...editando } : u))
      );
      setEditando(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar usuário.");
    } finally {
      setSalvando(false);
    }
  };

  // Ações por linha
  const actionTemplate = (row) => (
    <div className={styles.acoes}>
      <button
        className={`${styles.acaoBotao} `}
        onClick={() => handleEditar(row)}
        title="Editar"
      >
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button
        className={`${styles.acaoBotao} `}
        onClick={() => handleDeletar(row.id)}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div className={styles.tableContainer}>
      <DataTable value={usuarios} paginator rows={5} showGridlines>
        <Column field="id" header="ID" />
        <Column field="usuario" header="Usuário" />
        <Column field="tipo_usuario" header="Tipo de Usuário" />
        <Column
          body={actionTemplate}
          header="Ações"
          style={{ width: "120px" }}
        />
      </DataTable>

      {editando && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h3 className={styles.popupTitle}>
              Editar Usuário: {editando.usuario}
            </h3>

            <label className={styles.popupLabel}>Tipo de Usuário</label>
            <select
              className={styles.popupSelect}
              value={editando.tipo_usuario}
              onChange={(e) =>
                setEditando((old) => ({ ...old, tipo_usuario: e.target.value }))
              }
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Estoque">Estoque</option>
            </select>

            <label className={styles.popupLabel}>Tema Preferido</label>
            <select
              className={styles.popupSelect}
              value={editando.tema_preferido}
              onChange={(e) =>
                setEditando((old) => ({
                  ...old,
                  tema_preferido: e.target.value,
                }))
              }
            >
              <option value="claro">Claro</option>
              <option value="escuro">Escuro</option>
            </select>

            <div className={styles.popupActions}>
              <button
                className={styles.btnSalvar}
                onClick={salvarEdicao}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button
                className={styles.btnCancelar}
                onClick={() => setEditando(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
