"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/tabelas.module.css";

import { Filtros } from "../filtros";
import VisualizarFornecedor from "./visualizarFornecedor";
import EditarFornecedor from "./editarFornecedor";
import { deletarItem } from "../deletar";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TabelaFornecedores() {
  const [dados, setDados] = useState([]);

  // filtros
  const [filterId, setFilterId] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterNome, setFilterNome] = useState("");

  // modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fornecedorParaEditar, setFornecedorParaEditar] = useState(null);

  // Carregar fornecedores do backend
  const carregarFornecedores = async () => {
    try {
      const response = await fetch("http://localhost:5000/listar_fornecedores");
      if (!response.ok) throw new Error("Erro ao carregar fornecedores.");
      const resultado = await response.json();
      setDados(resultado);
    } catch (error) {
      alert("Erro ao carregar fornecedores.");
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  // Filtros
  const filteredData = dados.filter((item) => {
    return (
      (!filterId || item.id?.toString().startsWith(filterId)) &&
      (!filterCnpj || (item.cnpj || "").startsWith(filterCnpj)) &&
      (!filterNome ||
        (item.nome_empresa || "")
          .toLowerCase()
          .startsWith(filterNome.toLowerCase()))
    );
  });

  // template das ações
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setFornecedorSelecionado(rowData);
          setIsModalOpen(true);
        }}
        title="Visualizar"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>

      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setFornecedorParaEditar(rowData);
          setIsEditModalOpen(true);
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>

      <button
        className={styles.acaoBotao}
        onClick={async (e) => {
          e.stopPropagation();
          await deletarItem({
            itemId: rowData.id,
            itemTipo: "Fornecedor",
            onDelete: async () => {
              // Chama o backend para deletar
              try {
                const resp = await fetch(
                  `http://localhost:5000/deletar_fornecedor/${rowData.id}`,
                  { method: "DELETE" }
                );
                if (!resp.ok) throw new Error();
                setDados((prev) => prev.filter((f) => f.id !== rowData.id));
              } catch {
                alert("Erro ao deletar fornecedor.");
              }
            },
          });
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div>
      {/* filtros */}
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filterId}
            onChange={setFilterId}
            placeholder="Filtre por ID"
            label="ID"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterCnpj}
            onChange={setFilterCnpj}
            placeholder="Filtre por CNPJ"
            label="CNPJ"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterNome}
            onChange={setFilterNome}
            placeholder="Filtre por nome"
            label="Nome"
          />
        </div>
      </div>

      {/* tabela */}
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="cnpj" header="CNPJ" />
          <Column field="nome_empresa" header="Nome" />
          <Column field="email" header="Email" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {/* modais */}
        {isModalOpen && fornecedorSelecionado && (
          <VisualizarFornecedor
            fornecedor={fornecedorSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setFornecedorSelecionado(null);
            }}
          />
        )}

        {isEditModalOpen && fornecedorParaEditar && (
          <EditarFornecedor
            fornecedor={fornecedorParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setFornecedorParaEditar(null);
              carregarFornecedores(); // Atualiza após edição
            }}
          />
        )}
      </div>
    </div>
  );
}