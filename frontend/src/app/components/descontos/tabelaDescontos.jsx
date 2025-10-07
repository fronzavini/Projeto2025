"use client";
import styles from "../../styles/tabelas.module.css";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";

import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";

import { deletarItem } from "../deletar";
import EditarDesconto from "./editarDesconto";
import VisualizarDesconto from "./visualizarDesconto";

export default function TabelaDesconto() {
  const [dados, setDados] = useState([]);

  // Filtros
  const [filterProduto, setFilterProduto] = useState("");
  const [filterDesconto, setFilterDesconto] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");

  const opcoes = [
    { label: "Flores", value: "flores" },
    { label: "Arranjos", value: "arranjos" },
    { label: "Vasos", value: "vasos" },
  ];

  // Modal de edição e visualização
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [descontoParaEditar, setDescontoParaEditar] = useState(null);

  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [descontoParaVisualizar, setDescontoParaVisualizar] = useState(null);

  // Carregar descontos do backend
  const carregarDescontos = async () => {
    try {
      const response = await fetch("http://localhost:5000/listar_descontos");
      if (!response.ok) throw new Error("Erro ao carregar descontos.");
      const resultado = await response.json();
      setDados(resultado);
    } catch (error) {
      alert("Erro ao carregar descontos.");
    }
  };

  useEffect(() => {
    carregarDescontos();
  }, []);

  const filteredData = dados.filter(
    (item) =>
      (!filterProduto ||
        (item.produto || "").toLowerCase().includes(filterProduto.toLowerCase())) &&
      (!filterDesconto ||
        (item.desconto || "").toString().startsWith(filterDesconto)) &&
      (!filterCategoria || item.categoria === filterCategoria)
  );

  // Função para deletar desconto
  const handleDeleteDesconto = async (desconto) => {
    await deletarItem({
      itemId: desconto.id,
      itemTipo: "desconto",
      onDelete: async () => {
        try {
          const resp = await fetch(
            `http://localhost:5000/deletar_desconto/${desconto.id}`,
            { method: "DELETE" }
          );
          if (!resp.ok) throw new Error();
          setDados((prev) => prev.filter((d) => d.id !== desconto.id));
        } catch {
          alert("Erro ao deletar desconto.");
        }
      },
    });
  };

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setDescontoParaVisualizar(rowData);
          setIsVisualizarModalOpen(true);
        }}
        title="Visualizar"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setDescontoParaEditar(rowData);
          setIsEditModalOpen(true);
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteDesconto(rowData);
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div>
      {/* Filtros */}
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filterProduto}
            onChange={setFilterProduto}
            placeholder="Ex: Rosa"
            label="Produto"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterDesconto}
            onChange={setFilterDesconto}
            placeholder="10"
            label="Desconto"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterCategoria}
            onChange={setFilterCategoria}
            options={opcoes}
            placeholder="Todos"
            label="Categoria"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="produto" header="Produto" />
          <Column field="precoOriginal" header="Preço Original" />
          <Column field="desconto" header="Desconto (%)" />
          <Column field="precoComDesconto" header="Preço com Desconto" />
          <Column field="categoria" header="Categoria" />
          <Column field="data" header="Data" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {/* Modal de visualização */}
        {isVisualizarModalOpen && descontoParaVisualizar && (
          <VisualizarDesconto
            desconto={descontoParaVisualizar}
            onClose={() => {
              setIsVisualizarModalOpen(false);
              setDescontoParaVisualizar(null);
            }}
          />
        )}

        {/* Modal de edição */}
        {isEditModalOpen && descontoParaEditar && (
          <EditarDesconto
            desconto={descontoParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setDescontoParaEditar(null);
              carregarDescontos();
            }}
          />
        )}
      </div>
    </div>
  );
}