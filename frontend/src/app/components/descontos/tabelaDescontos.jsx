import styles from "../../styles/tabelas.module.css";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";

import { deletarItem } from "../deletar"; // função
import EditarDesconto from "./editarDesconto";

export default function TabelaDesconto() {
  const data = [
    {
      id: 1,
      produto: "Buquê de Rosas Vermelhas",
      precoOriginal: 120,
      desconto: 10,
      precoComDesconto: 108,
      categoria: "flores",
      data: "2025-09-11",
    },
    {
      id: 2,
      produto: "Orquídea Branca",
      precoOriginal: 85,
      desconto: 15,
      precoComDesconto: 72.25,
      categoria: "flores",
      data: "2025-09-10",
    },
    {
      id: 3,
      produto: "Girassol Amarelo",
      precoOriginal: 60,
      desconto: 20,
      precoComDesconto: 48,
      categoria: "flores",
      data: "2025-09-09",
    },
    {
      id: 4,
      produto: "Lírio Branco",
      precoOriginal: 95,
      desconto: 5,
      precoComDesconto: 90.25,
      categoria: "flores",
      data: "2025-09-08",
    },
    {
      id: 5,
      produto: "Tulipas Coloridas",
      precoOriginal: 110,
      desconto: 12,
      precoComDesconto: 96.8,
      categoria: "flores",
      data: "2025-09-07",
    },
    {
      id: 6,
      produto: "Ramalhete de Margaridas",
      precoOriginal: 50,
      desconto: 8,
      precoComDesconto: 46,
      categoria: "flores",
      data: "2025-09-06",
    },
    {
      id: 7,
      produto: "Cesta de Flores do Campo",
      precoOriginal: 150,
      desconto: 18,
      precoComDesconto: 123,
      categoria: "arranjos",
      data: "2025-09-05",
    },
    {
      id: 8,
      produto: "Vaso de Violetas",
      precoOriginal: 40,
      desconto: 25,
      precoComDesconto: 30,
      categoria: "vasos",
      data: "2025-09-04",
    },
  ];

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
  const handleDeleteDesconto = (desconto) => {
    deletarItem({
      itemId: desconto.id,
      itemTipo: "desconto",
      onDelete: () => {
        console.log("Desconto removido:", desconto.id);
        // Aqui você pode atualizar o estado ou recarregar os dados
      },
      onClose: () => console.log("Modal de exclusão fechado"),
    });
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

        {/* Modal de edição */}
        {isEditModalOpen && descontoParaEditar && (
          <EditarDesconto
            descontoInicial={descontoParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setDescontoParaEditar(null);
            }}
            onConfirm={(dadosAtualizados) => {
              console.log("Desconto atualizado:", dadosAtualizados);
              setIsEditModalOpen(false);
              setDescontoParaEditar(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
