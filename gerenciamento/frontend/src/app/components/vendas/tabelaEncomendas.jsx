"use client";
import { useState, useEffect } from "react";
import { Filtros } from "../filtros";
import styles from "../../styles/tabelas.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import VisualizarEncomenda from "./visualizarEncomenda";
import EditarEncomenda from "./editarEncomenda";

export default function TabelaEncomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [filterID, setFilterID] = useState("");
  const [filterDataVenda, setFilterDataVenda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [encomendaSelecionada, setEncomendaSelecionada] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [encomendaParaEditar, setEncomendaParaEditar] = useState(null);

  const carregarEncomendas = async () => {
    try {
      const res = await fetch("http://192.168.18.155:5000/listar_vendas", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erro ao carregar encomendas");

      const resultado = await res.json();

      const encomendasFormatadas = (resultado || []).map((v) => ({
        id: v[0],
        cliente: v[1],
        funcionario: v[2],
        produtos: v[3],
        valorTotal: v[4],
        dataVenda: v[5],
        entrega: v[6],
        dataEntrega: v[7],
      }));

      setEncomendas(encomendasFormatadas);
    } catch (err) {
      console.error("Erro ao carregar encomendas:", err);
      setEncomendas([]);
    }
  };

  useEffect(() => {
    carregarEncomendas();
  }, []);

  const filteredData = encomendas.filter((item) => {
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
    if (!confirm("Deseja realmente deletar esta encomenda?")) return;
    try {
      const res = await fetch(`http://192.168.18.155:5000/deletar_venda/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar");
      alert("Encomenda deletada com sucesso!");
      setEncomendas((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao deletar encomenda.");
    }
  };

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setEncomendaSelecionada(rowData);
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
          setEncomendaParaEditar(rowData);
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
            placeholder="ID da encomenda"
            label="ID Encomenda"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            type="date"
            value={filterDataVenda}
            onChange={setFilterDataVenda}
            label="Data Encomenda"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID Encomenda" />
          <Column field="cliente" header="Cliente ID" />
          <Column field="funcionario" header="Funcionário ID" />
          <Column
            field="dataVenda"
            header="Data Encomenda"
            body={(rowData) => {
              const date = new Date(rowData.dataVenda);
              return date.toLocaleDateString("pt-BR");
            }}
          />
          <Column
            field="dataEntrega"
            header="Data Entrega"
            body={(rowData) => {
              if (rowData.dataEntrega) {
                const date = new Date(rowData.dataEntrega);
                return date.toLocaleDateString("pt-BR");
              }
              return "-";
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

        {isModalOpen && encomendaSelecionada && (
          <VisualizarEncomenda
            encomenda={encomendaSelecionada}
            onClose={() => {
              setIsModalOpen(false);
              setEncomendaSelecionada(null);
            }}
          />
        )}

        {isEditModalOpen && encomendaParaEditar && (
          <EditarEncomenda
            encomenda={encomendaParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setEncomendaParaEditar(null);
              carregarEncomendas();
            }}
          />
        )}
      </div>
    </div>
  );
}
