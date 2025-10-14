import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/tabelas.module.css";
import { FiltroDropdown } from "../filtrosDropdown";
import EditarFinanceiro from "./editarFinanceiro";

export default function TabelaFinanceiro() {
  const data = [
    {
      id: 1,
      data: "2025-07-01",
      descricao: "Venda de buquê de rosas",
      categoria: "Receita",
      subcategoria: "Venda Loja Física",
      origem: "Loja Central",
      valor: 150,
      formaPagamento: "Pix",
      status: "Recebido",
    },
    {
      id: 2,
      data: "2025-07-02",
      descricao: "Pagamento de aluguel da loja",
      categoria: "Despesa",
      subcategoria: "Aluguel",
      origem: "Proprietário",
      valor: 2000,
      formaPagamento: "Transferência Bancária",
      status: "Pago",
    },
    {
      id: 3,
      data: "2025-07-03",
      descricao: "Compra de flores no atacado",
      categoria: "Despesa",
      subcategoria: "Compra de Mercadorias / Insumos",
      origem: "Fornecedor Flores Brasil",
      valor: 850,
      formaPagamento: "Boleto",
      status: "Pendente",
    },
    {
      id: 4,
      data: "2025-07-04",
      descricao: "Venda arranjo decorativo casamento",
      categoria: "Receita",
      subcategoria: "Venda Online",
      origem: "Site Oficial",
      valor: 320,
      formaPagamento: "Cartão de Crédito",
      status: "Recebido",
    },
    {
      id: 5,
      data: "2025-07-05",
      descricao: "Compra de computador para caixa",
      categoria: "Investimento",
      subcategoria: "Compra de Equipamentos",
      origem: "TechStore",
      valor: 2800,
      formaPagamento: "Cartão de Crédito",
      status: "Cancelado",
    },
    {
      id: 6,
      data: "2025-07-06",
      descricao: "Campanha de anúncios no Instagram",
      categoria: "Despesa",
      subcategoria: "Marketing e Divulgação",
      origem: "Meta Ads",
      valor: 150,
      formaPagamento: "Cartão de Crédito",
      status: "Pago",
    },
    {
      id: 7,
      data: "2025-07-07",
      descricao: "Serviço de decoração de evento",
      categoria: "Receita",
      subcategoria: "Serviço de Montagem / Decoração",
      origem: "Cliente Maria Souza",
      valor: 1200,
      formaPagamento: "Dinheiro",
      status: "Recebido",
    },
  ];

  const opcoesCategoria = [
    { label: "Receita", value: "Receita" },
    { label: "Despesa", value: "Despesa" },
    { label: "Investimento", value: "Investimento" },
  ];

  const opcoesSubcategoria = [
    {
      label: "Venda Loja Física",
      value: "Venda Loja Física",
      categoria: "Receita",
    },
    { label: "Venda Online", value: "Venda Online", categoria: "Receita" },
    {
      label: "Serviço de Montagem / Decoração",
      value: "Serviço de Montagem / Decoração",
      categoria: "Receita",
    },
    { label: "Aluguel", value: "Aluguel", categoria: "Despesa" },
    {
      label: "Compra de Mercadorias / Insumos",
      value: "Compra de Mercadorias / Insumos",
      categoria: "Despesa",
    },
    {
      label: "Marketing e Divulgação",
      value: "Marketing e Divulgação",
      categoria: "Despesa",
    },
    {
      label: "Compra de Equipamentos",
      value: "Compra de Equipamentos",
      categoria: "Investimento",
    },
  ];

  const opcoesFormaPagamento = [
    { label: "Pix", value: "Pix" },
    { label: "Cartão de Crédito", value: "Cartão de Crédito" },
    { label: "Cartão de Débito", value: "Cartão de Débito" },
    { label: "Dinheiro", value: "Dinheiro" },
    { label: "Boleto", value: "Boleto" },
    { label: "Transferência Bancária", value: "Transferência Bancária" },
  ];

  const opcoesStatus = [
    { label: "Pendente", value: "Pendente" },
    { label: "Recebido", value: "Recebido" },
    { label: "Pago", value: "Pago" },
    { label: "Cancelado", value: "Cancelado" },
  ];

  // Estado unificado de filtros
  const [filters, setFilters] = useState({
    categoria: "",
    subcategoria: "",
    formaPagamento: "",
    status: "",
  });

  // Modal de edição
  const [modalEditar, setModalEditar] = useState({
    open: false,
    registro: null,
  });

  const subcategoriasFiltradas = filters.categoria
    ? opcoesSubcategoria.filter((s) => s.categoria === filters.categoria)
    : [];

  const filteredData = data.filter(
    (item) =>
      (!filters.categoria || item.categoria === filters.categoria) &&
      (!filters.subcategoria || item.subcategoria === filters.subcategoria) &&
      (!filters.formaPagamento ||
        item.formaPagamento === filters.formaPagamento) &&
      (!filters.status || item.status === filters.status)
  );

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setModalEditar({ open: true, registro: rowData });
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
    </div>
  );

  const statusTemplate = (rowData) => {
    const status = rowData.status?.toLowerCase() || "indefinido";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status}
      </span>
    );
  };

  return (
    <div>
      <div className={styles["filters-container"]}>
        <FiltroDropdown
          value={filters.categoria}
          onChange={(val) =>
            setFilters({ ...filters, categoria: val, subcategoria: "" })
          }
          options={opcoesCategoria}
          label="Categoria"
          placeholder="Selecione uma categoria"
        />

        <FiltroDropdown
          value={filters.subcategoria}
          onChange={(val) => setFilters({ ...filters, subcategoria: val })}
          options={subcategoriasFiltradas}
          label="Subcategoria"
          placeholder="Selecione subcategoria"
          disabled={!filters.categoria}
        />

        <FiltroDropdown
          value={filters.formaPagamento}
          onChange={(val) => setFilters({ ...filters, formaPagamento: val })}
          options={opcoesFormaPagamento}
          label="Forma de Pagamento"
          placeholder="Selecione o pagamento"
        />

        <FiltroDropdown
          value={filters.status}
          onChange={(val) => setFilters({ ...filters, status: val })}
          options={opcoesStatus}
          label="Status"
          placeholder="Selecione o status"
        />
      </div>

      <DataTable
        value={filteredData}
        paginator
        rows={5}
        showGridlines
        className={styles["custom-table-container"]}
      >
        <Column field="id" header="ID" />
        <Column field="data" header="Data" />
        <Column field="descricao" header="Descrição" />
        <Column field="categoria" header="Categoria" />
        <Column field="subcategoria" header="Subcategoria" />
        <Column field="origem" header="Origem" />
        <Column
          field="valor"
          header="Valor"
          body={(row) => `R$${row.valor.toFixed(2)}`}
        />
        <Column field="formaPagamento" header="Forma de Pagamento" />
        <Column field="status" header="Status" body={statusTemplate} />
        <Column
          body={actionTemplate}
          header="Ações"
          style={{ width: "100px" }}
        />
      </DataTable>

      {modalEditar.open && modalEditar.registro && (
        <EditarFinanceiro
          registro={modalEditar.registro}
          onClose={() => setModalEditar({ open: false, registro: null })}
        />
      )}
    </div>
  );
}