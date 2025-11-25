"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";

import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";
import VisualizarPedido from "./visualizarPedido";
import styles from "../../styles/tabelas.module.css";

export default function TabelaVendas() {
  const [vendas, setVendas] = useState([]);

  const carregarVendas = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_vendas", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erro ao carregar vendas");

      const resultado = await res.json();

      const vendasFormatadas = (resultado || []).map((v) => ({
        id: v[0],
        cliente: v[1],
        funcionario: v[2],
        produtos: v[3],
        valorTotal: v[4],
        dataVenda: v[5],
        entrega: v[6],
        dataEntrega: v[7],
      }));

      setVendas(vendasFormatadas);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
      setVendas([]);
    }
  };

  useEffect(() => {
    carregarVendas();
  }, []);

  // Estados dos filtros
  const [filterID, setFilterID] = useState("");
  const [filterDataVenda, setFilterDataVenda] = useState("");

  // Modal para visualizar pedido
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // Dados filtrados com base nos filtros
  const filteredData = vendas.filter((item) => {
    const idStr = item.id ? item.id.toString() : "";
    const dataVendaStr = item.dataVenda
      ? item.dataVenda.toString().slice(0, 10)
      : "";

    return (
      (!filterID || idStr.includes(filterID)) &&
      (!filterDataVenda || dataVendaStr.startsWith(filterDataVenda))
    );
  });

  // Deletar venda
  const handleDeletar = async (id) => {
    if (!confirm("Deseja realmente deletar esta venda?")) return;
    try {
      const res = await fetch(`http://localhost:5000/deletar_venda/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar");
      alert("Venda deletada com sucesso!");
      setVendas((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao deletar venda.");
    }
  };

  // Botão ação "Visualizar" e "Deletar"
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setPedidoSelecionado(rowData);
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
            placeholder="ID da venda"
            label="ID Venda"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            type="date"
            value={filterDataVenda}
            onChange={setFilterDataVenda}
            label="Data Venda"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID Venda" />
          <Column field="cliente" header="Cliente ID" />
          <Column field="funcionario" header="Funcionário ID" />
          <Column
            field="dataVenda"
            header="Data Venda"
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
            style={{ width: "120px" }}
          />
        </DataTable>

        {isModalOpen && pedidoSelecionado && (
          <VisualizarPedido
            pedido={pedidoSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setPedidoSelecionado(null);
            }}
          />
        )}
      </div>
    </div>
  );
}