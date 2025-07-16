import styles from "../styles/tabelas.module.css";

import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";
import type { Opcao } from "./FiltrosDropdown";

import VisualizarProduto from "./VisualizarProdutos";
import EditarProduto from "./EditarProduto";
import DeletarProduto from "./DeletarProduto";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TabelaProduto() {
  const data = [
    {
      id: 1,
      nome: "Buquê de Rosas Vermelhas",
      categoria: "Flores",
      marca: "FlorBella",
      preco: 59.9,
      quantidade_estoque: 30,
      estoque_minimo: 5,
      estado: true,
      fornecedor_id: 1,
      imagem:
        "https://static.cestasmichelli.com.br/images/product/26148gg.jpg?ims=750x750",
    },
    {
      id: 2,
      nome: "Orquídea Branca",
      categoria: "Plantas",
      marca: "Orquiflor",
      preco: 79.5,
      quantidade_estoque: 20,
      estoque_minimo: 4,
      estado: true,
      fornecedor_id: 2,
      imagem:
        "https://cdn.awsli.com.br/600x700/601/601454/produto/98264100/24d915e5d7.jpg",
    },
    {
      id: 3,
      nome: "Adubo Orgânico 1kg",
      categoria: "Acessórios",
      marca: "Naturagro",
      preco: 25.0,
      quantidade_estoque: 50,
      estoque_minimo: 10,
      estado: true,
      fornecedor_id: 3,
      imagem:
        "https://images.tcdn.com.br/img/img_prod/649920/adubo_e_composto_organico_1kg_esterco_bovino_leiteiro_1331_2_bf1ca3ce220587575ce146ea1084628e.jpg",
    },
    {
      id: 4,
      nome: "Vaso Cerâmico Branco",
      categoria: "Vasos",
      marca: "DecorVasos",
      preco: 39.99,
      quantidade_estoque: 15,
      estoque_minimo: 3,
      estado: true,
      fornecedor_id: 4,
      imagem:
        "https://images.tcdn.com.br/img/img_prod/774792/cachepot_de_ceramica_branco_bretagne_19x15cm_10719_1_b22ce33b2de2f2dda050d6c2d3f5c3e1.jpg",
    },
    {
      id: 5,
      nome: "Rosa do Deserto",
      categoria: "Plantas",
      marca: "JardimVivo",
      preco: 89.0,
      quantidade_estoque: 12,
      estoque_minimo: 2,
      estado: false,
      fornecedor_id: 2,
      imagem:
        "https://veiling.com.br/wp-content/uploads/2025/06/rosa-do-des-dobrado-683e423b6210a.jpeg",
    },
  ];

  // Estados dos filtros
  const [filterId, setFilterId] = useState("");
  const [filterNome, setFilterNome] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Opções para filtro status
  const opcoesStatus: Opcao[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  // Cria opções únicas para filtros tipo (marca) e categoria
  const tipos = Array.from(new Set(data.map((d) => d.marca))).map((v) => ({
    label: v,
    value: v,
  }));
  const categorias = Array.from(new Set(data.map((d) => d.categoria))).map(
    (v) => ({ label: v, value: v })
  );

  // Função para renderizar o status com badge colorido
  const statusTemplate = (rowData) => {
    const status = rowData.estado ? "ativo" : "inativo";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.estado ? "Ativo" : "Inativo"}
      </span>
    );
  };

  // Dados filtrados conforme filtros aplicados
  const filteredData = data.filter((item) => {
    const statusStr = item.estado ? "ativo" : "inativo";
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterNome ||
        item.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
      (!filterTipo || item.marca === filterTipo) &&
      (!filterCategoria || item.categoria === filterCategoria) &&
      (!filterStatus || statusStr === filterStatus)
    );
  });

  // Estados para modais e produto selecionado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  // Template para ações (visualizar, editar, deletar)
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setProdutoSelecionado(rowData);
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
          setProdutoParaEditar(rowData);
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
          setProdutoParaExcluir(rowData);
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
            value={filterNome}
            onChange={setFilterNome}
            placeholder="Ex: Rosa"
            label="Nome"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterId}
            onChange={setFilterId}
            placeholder="# 12345"
            label="ID Produto"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterTipo}
            onChange={setFilterTipo}
            options={tipos}
            placeholder="Todos"
            label="Tipo"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterCategoria}
            onChange={setFilterCategoria}
            options={categorias}
            placeholder="Todos"
            label="Categoria"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            options={opcoesStatus}
            placeholder="Todos"
            label="Status"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable
          value={filteredData}
          paginator
          rows={5}
          showGridlines
          rowKey="id"
        >
          <Column
            field="imagem"
            header="Imagem"
            body={(rowData) => (
              <img
                src={rowData.imagem}
                alt={rowData.nome}
                style={{ width: "40px", height: "40px", borderRadius: "8px" }}
              />
            )}
          />
          <Column field="nome" header="Nome" />
          <Column field="id" header="ID" />
          <Column field="marca" header="Tipo" />
          <Column field="categoria" header="Categoria" />
          <Column
            field="preco"
            header="Valor"
            body={(rowData) => `R$ ${rowData.preco.toFixed(2)}`}
          />
          <Column field="estado" header="Status" body={statusTemplate} />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {isModalOpen && produtoSelecionado && (
          <VisualizarProduto
            produto={produtoSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setProdutoSelecionado(null);
            }}
          />
        )}

        {isEditModalOpen && produtoParaEditar && (
          <EditarProduto
            produto={produtoParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setProdutoParaEditar(null);
            }}
          />
        )}

        {isDeleteModalOpen && produtoParaExcluir && (
          <DeletarProduto
            produtoId={produtoParaExcluir.id.toString()}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={() => setIsDeleteModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
