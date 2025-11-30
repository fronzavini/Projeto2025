"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/tabelas.module.css";

export default function TabelaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const carregarUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_usuarios", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erro ao carregar usuários");
      const resultado = await res.json();

      const usuariosFormatados = (resultado || []).map((u) => ({
        id: u.id,
        usuario: u.usuario,
        funcionario_id: u.funcionario_id,
      }));

      setUsuarios(usuariosFormatados);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleDeletar = async (id) => {
    if (!confirm("Deseja realmente deletar este usuário?")) return;
    try {
      const res = await fetch(`http://localhost:5000/deletar_usuario/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar");
      alert("Usuário deletado com sucesso!");
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao deletar usuário.");
    }
  };

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          handleDeletar(rowData.id);
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div className={styles["custom-table-container"]}>
      <DataTable value={usuarios} paginator rows={5} showGridlines>
        <Column field="id" header="ID" />
        <Column field="usuario" header="Usuário" />
        <Column
          body={actionTemplate}
          header="Ações"
          style={{ width: "100px" }}
        />
      </DataTable>
    </div>
  );
}
