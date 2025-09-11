"use client";
import { useState } from "react";
import styles from "../../styles/configuracoes.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faTrash,
  faUsers,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import VisualizarPerfil from "./visualizarPerfil";
import EditarPerfil from "./editarPerfil";
import CadastrarPerfil from "./cadastrarPerfil";
import { deletarItem } from "../deletar";

export default function PerfisCard() {
  const initialData = [
    {
      id: 1,
      nome: "Administrador",
      permissoes: "Todos os módulos",
      ativo: true,
    },
    { id: 2, nome: "Vendedor", permissoes: "Vendas, Clientes", ativo: true },
    { id: 3, nome: "Estoque", permissoes: "Produtos, Estoque", ativo: false },
  ];

  const [perfis, setPerfis] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [perfilParaEditar, setPerfilParaEditar] = useState(null);
  const [isCadastrarModalOpen, setIsCadastrarModalOpen] = useState(false);

  // Badge de status
  const statusTemplate = (rowData) => (
    <span
      className={`${styles["status-badge"]} ${
        rowData.ativo ? styles.ativo : styles.inativo
      }`}
    >
      {rowData.ativo ? "Ativo" : "Inativo"}
    </span>
  );

  // Botões de ação
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles["acao-botao"]}
        onClick={(e) => {
          e.stopPropagation();
          setPerfilSelecionado(rowData);
          setIsModalOpen(true);
        }}
        title="Visualizar"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>

      <button
        className={styles["acao-botao"]}
        onClick={(e) => {
          e.stopPropagation();
          setPerfilParaEditar(rowData);
          setIsEditModalOpen(true);
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>

      <button
        className={styles["acao-botao"]}
        onClick={(e) => {
          e.stopPropagation();
          deletarItem({
            itemId: rowData.id,
            itemTipo: "Perfil",
            onDelete: () =>
              setPerfis((prev) => prev.filter((p) => p.id !== rowData.id)),
          });
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h3 className={styles.titulo}>
          <FontAwesomeIcon icon={faUsers} className={styles.icone} /> Perfis de
          Usuário
        </h3>

        <DataTable
          value={perfis}
          paginator
          rows={5}
          showGridlines
          className={styles["tabela-perfis"]}
        >
          <Column field="nome" header="Perfil" />
          <Column field="permissoes" header="Permissões" />
          <Column field="ativo" header="Status" body={statusTemplate} />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        <button
          className={styles.botao}
          onClick={() => setIsCadastrarModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Novo Perfil
        </button>

        {isModalOpen && perfilSelecionado && (
          <VisualizarPerfil
            perfil={perfilSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setPerfilSelecionado(null);
            }}
          />
        )}

        {isEditModalOpen && perfilParaEditar && (
          <EditarPerfil
            perfil={perfilParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setPerfilParaEditar(null);
            }}
          />
        )}

        {isCadastrarModalOpen && (
          <CadastrarPerfil
            onClose={() => setIsCadastrarModalOpen(false)}
            onCadastrar={(novoPerfil) => {
              setPerfis((prev) => [...prev, novoPerfil]);
              setIsCadastrarModalOpen(false);
            }}
          />
        )}
      </div>
    </section>
  );
}
