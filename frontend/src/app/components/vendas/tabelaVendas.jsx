"use client";
import styles from "../../styles/tabelas.module.css";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Filtros } from "../filtros";
import VisualizarPedido from "./visualizarPedido";
import { deletarItem } from "../deletar";

export default function TabelaVendas() {
  const [dados, setDados] = useState([]);
  const [filterCliente, setFilterCliente] = useState("");
  const [filterData, setFilterData] = useState("");
  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [pedidoParaVisualizar, setPedidoParaVisualizar] = useState(null);

  const carregarVendas = async () => {
    try {
      const response = await fetch("http://localhost:5000/listar_vendas");
      if (!response.ok) throw new Error("Erro ao carregar vendas.");
      const resultado = await response.json();
      setDados(resultado);
    } catch (error) {
      alert("Erro ao carregar vendas.");
    }
  };

  useEffect(() => {
    carregarVendas();
  }, []);

  const filteredData = dados.filter(
    (item) =>
      (!filterCliente ||
        (item.cliente || "").toLowerCase().includes(filterCliente.toLowerCase())) &&
      (!filterData ||
        (item.dataVenda || "").toString().startsWith(filterData))
  );

  const handleDeleteVenda = async (venda) => {
    await deletarItem({
      itemId: venda.id,
      itemTipo: "venda",
      onDelete: async () => {
        try {
          const resp = await fetch(
            `http://localhost:5000/deletar_venda/${venda.id}`,
            { method: "DELETE" }
          );
          if (!resp.ok) throw new Error();
          setDados((prev) => prev.filter((d) => d.id !== venda.id));
        } catch {
          alert("Erro ao deletar venda.");
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
          setPedidoParaVisualizar(rowData);
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
          // Aqui você pode abrir um modal de edição se desejar
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteVenda(rowData);
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
            value={filterCliente}
            onChange={setFilterCliente}
            placeholder="Cliente"
            label="Cliente"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterData}
            onChange={setFilterData}
            placeholder="Data"
            label="Data"
          />
        </div>
      </div>
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="cliente" header="Cliente" />
          <Column field="funcionario" header="Funcionário" />
          <Column field="dataVenda" header="Data da Venda" />
          <Column field="valorTotal" header="Valor Total" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "120px" }}
          />
        </DataTable>
        {isVisualizarModalOpen && pedidoParaVisualizar && (
          <VisualizarPedido
            pedido={pedidoParaVisualizar}
            onClose={() => {
              setIsVisualizarModalOpen(false);
              setPedidoParaVisualizar(null);
            }}
          />
        )}
      </div>
    </div>
  );
}