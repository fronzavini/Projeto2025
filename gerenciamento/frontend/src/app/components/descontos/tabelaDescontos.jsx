import styles from "../../styles/tabelas.module.css";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";

import { deletarItem } from "../deletar"; // função
import EditarDesconto from "./editarDesconto";

export default function TabelaDesconto() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar descontos do backend
  useEffect(() => {
    async function fetchDescontos() {
      try {
        const res = await fetch("http://localhost:5000/descontos");
        const descontos = await res.json();
        setData(descontos);
      } catch (err) {
        console.error("Erro ao buscar descontos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDescontos();
  }, []);

  const [filterProduto, setFilterProduto] = useState("");
  const [filterDesconto, setFilterDesconto] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");

  const opcoes = [
    { label: "Flores", value: "flores" },
    { label: "Arranjos", value: "arranjos" },
    { label: "Vasos", value: "vasos" },
  ];

  const filteredData = data.filter(
    (item) =>
      (!filterProduto ||
        item.produto.toLowerCase().includes(filterProduto.toLowerCase())) &&
      (!filterDesconto ||
        item.desconto.toString().startsWith(filterDesconto)) &&
      (!filterCategoria || item.categoria === filterCategoria)
  );

  // Modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [descontoParaEditar, setDescontoParaEditar] = useState(null);

  // Função para deletar desconto
  const handleDeleteDesconto = async (desconto) => {
    try {
      await fetch(`http://localhost:5000/descontos/${desconto.id}`, {
        method: "DELETE",
      });
      setData((old) => old.filter((d) => d.id !== desconto.id));
    } catch (err) {
      console.error("Erro ao deletar desconto:", err);
    }
  };

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
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
        <DataTable
          value={filteredData}
          paginator
          rows={5}
          showGridlines
          loading={loading}
        >
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

        {/* Modal de edição */}
        {isEditModalOpen && descontoParaEditar && (
          <EditarDesconto
            descontoInicial={descontoParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setDescontoParaEditar(null);
            }}
            onConfirm={async (dadosAtualizados) => {
              try {
                const res = await fetch(
                  `http://localhost:5000/descontos/${descontoParaEditar.id}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosAtualizados),
                  }
                );
                if (res.ok) {
                  setData((old) =>
                    old.map((d) =>
                      d.id === descontoParaEditar.id
                        ? { ...d, ...dadosAtualizados }
                        : d
                    )
                  );
                }
              } catch (err) {
                console.error("Erro ao atualizar desconto:", err);
              }
              setIsEditModalOpen(false);
              setDescontoParaEditar(null);
            }}
          />
        )}
      </div>
    </div>
  );
}