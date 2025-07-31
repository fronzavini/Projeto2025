import styles from "../styles/tabelas.module.css";

import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";
import type { Opcao } from "./FiltrosDropdown";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import CancelarDesconto from "./CancelarDesconto";
import EditarDesconto from "./EditarDesconto";

// Define tipo para Desconto
type Desconto = {
  id: number;
  produto: string;
  precoOriginal: number;
  desconto: number;
  precoComDesconto: number;
  categoria: string;
};

export default function TabelaDesconto() {
  const data: Desconto[] = [
    {
      id: 1,
      produto: "Buquê de Rosas Vermelhas",
      precoOriginal: 120,
      desconto: 10,
      precoComDesconto: 108,
      categoria: "flores",
    },
    {
      id: 2,
      produto: "Orquídea Branca",
      precoOriginal: 85,
      desconto: 15,
      precoComDesconto: 72.25,
      categoria: "flores",
    },
    {
      id: 3,
      produto: "Girassol Amarelo",
      precoOriginal: 60,
      desconto: 20,
      precoComDesconto: 48,
      categoria: "flores",
    },
    {
      id: 4,
      produto: "Lírio Branco",
      precoOriginal: 95,
      desconto: 5,
      precoComDesconto: 90.25,
      categoria: "flores",
    },
    {
      id: 5,
      produto: "Tulipas Coloridas",
      precoOriginal: 110,
      desconto: 12,
      precoComDesconto: 96.8,
      categoria: "flores",
    },
    {
      id: 6,
      produto: "Ramalhete de Margaridas",
      precoOriginal: 50,
      desconto: 8,
      precoComDesconto: 46,
      categoria: "flores",
    },
    {
      id: 7,
      produto: "Cesta de Flores do Campo",
      precoOriginal: 150,
      desconto: 18,
      precoComDesconto: 123,
      categoria: "arranjos",
    },
    {
      id: 8,
      produto: "Vaso de Violetas",
      precoOriginal: 40,
      desconto: 25,
      precoComDesconto: 30,
      categoria: "vasos",
    },
  ];

  const [filterProduto, setFilterProduto] = useState("");
  const [filterDesconto, setFilterDesconto] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");

  const opcoes: Opcao[] = [
    { label: "Flores", value: "flores" },
    { label: "Arranjos", value: "arranjos" },
    { label: "Vasos", value: "vasos" },
  ];

  const filteredData = data.filter((item) => {
    return (
      (!filterProduto ||
        item.produto.toLowerCase().includes(filterProduto.toLowerCase())) &&
      (!filterDesconto ||
        item.desconto.toString().startsWith(filterDesconto)) &&
      (!filterCategoria || item.categoria === filterCategoria)
    );
  });

  // Estados com tipagem correta
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [descontoParaEditar, setDescontoParaEditar] = useState<Desconto | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [descontoParaExcluir, setDescontoParaExcluir] =
    useState<Desconto | null>(null);

  const actionTemplate = (rowData: Desconto) => (
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
          setDescontoParaExcluir(rowData);
          setIsDeleteModalOpen(true);
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

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="produto" header="Produto" />
          <Column field="precoOriginal" header="Preço original" />
          <Column field="desconto" header="Desconto" />
          <Column field="precoComDesconto" header="Preço com desconto" />
          <Column field="categoria" header="Categoria" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {isDeleteModalOpen && descontoParaExcluir && (
          <CancelarDesconto
            descontoId={descontoParaExcluir.id}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              // Ação para cancelar desconto, aqui só fecha o modal
              console.log("Cancelar desconto:", descontoParaExcluir.id);
              setIsDeleteModalOpen(false);
              // Aqui você pode adicionar a lógica para remover da lista, se quiser
            }}
          />
        )}

        {isEditModalOpen && descontoParaEditar && (
          <EditarDesconto
            descontoInicial={descontoParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setDescontoParaEditar(null);
            }}
            onConfirm={(dadosAtualizados) => {
              // Aqui você pode atualizar a lista, chamar API, etc
              console.log("Desconto atualizado:", dadosAtualizados);

              // Fechar modal depois de confirmar
              setIsEditModalOpen(false);
              setDescontoParaEditar(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
