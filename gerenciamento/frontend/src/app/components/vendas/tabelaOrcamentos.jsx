"use client";
import { useState, useEffect } from "react";
import { Filtros } from "../filtros";
import styles from "../../styles/tabelas.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import VisualizarOrcamento from "./visualizarOrcamento";
import EditarOrcamento from "./editarOrcamento";

export default function TabelaOrcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [filterID, setFilterID] = useState("");
  const [filterDataVenda, setFilterDataVenda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orcamentoParaEditar, setOrcamentoParaEditar] = useState(null);

  const carregarOrcamentos = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_vendas", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erro ao carregar orçamentos");

      const resultado = await res.json();

      const orcamentosFormatados = (resultado || []).map((v) => ({
        id: v[0],
        cliente: v[1],
        funcionario: v[2],
        produtos: v[3],
        valorTotal: v[4],
        dataVenda: v[5],
        entrega: v[6],
        dataEntrega: v[7],
      }));

      setOrcamentos(orcamentosFormatados);
    } catch (err) {
      console.error("Erro ao carregar orçamentos:", err);
      setOrcamentos([]);
    }
  };

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const filteredData = orcamentos.filter((item) => {
    const idStr = item.id ? item.id.toString() : "";
    const dataVendaStr = item.dataVenda
      ? item.dataVenda.toString().slice(0, 10)
      : "";

    return (
      (!filterID || idStr.includes(filterID)) &&
      (!filterDataVenda || dataVendaStr.startsWith(filterDataVenda))
    );
  });

  const handleDeletar = async (id) => {
    if (!confirm("Deseja realmente deletar este orçamento?")) return;
    try {
      const res = await fetch(`http://localhost:5000/deletar_venda/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar");
      alert("Orçamento deletado com sucesso!");
      setOrcamentos((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao deletar orçamento.");
    }
  };

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setOrcamentoSelecionado(rowData);
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
          setOrcamentoParaEditar(rowData);
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
          handleDeletar(rowData.id);
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div>
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filterID}
            onChange={setFilterID}
            placeholder="ID do orçamento"
            label="ID Orçamento"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            type="date"
            value={filterDataVenda}
            onChange={setFilterDataVenda}
            label="Data Orçamento"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID Orçamento" />
          <Column field="cliente" header="Cliente ID" />
          <Column field="funcionario" header="Funcionário ID" />
          <Column
            field="dataVenda"
            header="Data Orçamento"
            body={(rowData) => {
              const date = new Date(rowData.dataVenda);
              return date.toLocaleDateString("pt-BR");
            }}
          />
          <Column
            field="valorTotal"
            header="Valor Total"
            body={(rowData) => `R$ ${Number(rowData.valorTotal).toFixed(2)}`}
          />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {isModalOpen && orcamentoSelecionado && (
          <VisualizarOrcamento
            orcamento={orcamentoSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setOrcamentoSelecionado(null);
            }}
          />
        )}

        {isEditModalOpen && orcamentoParaEditar && (
          <EditarOrcamento
            orcamento={orcamentoParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setOrcamentoParaEditar(null);
              carregarOrcamentos();
            }}
          />
        )}
      </div>
    </div>
  );
}