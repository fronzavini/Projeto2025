import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import styles from "../styles/tabelas.module.css";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiltroDropdown } from "./FiltrosDropdown";
import EditarFinanceiro from "./EditarFinanceiro";

type Opcao = {
  label: string;
  value: string;
};

type OpcaoComCategoria = Opcao & {
  categoria: string;
};

export default function TabelaFinanceiro() {
  // Dados fixos de exemplo
  const data = [
    {
      id: 1,
      data: "2025-07-01",
      descricao: "Venda de buquê de rosas",
      categoria: "Receita",
      subcategoria: "Venda Loja Física",
      origem: "Loja Central",
      valor: 150.0,
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
      valor: 2000.0,
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
      valor: 850.0,
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
      valor: 320.0,
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
      valor: 2800.0,
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
      valor: 150.0,
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
      valor: 1200.0,
      formaPagamento: "Dinheiro",
      status: "Recebido",
    },
  ];

  // Opções para filtros
  const opcoesCategoria: Opcao[] = [
    { label: "Receita", value: "Receita" },
    { label: "Despesa", value: "Despesa" },
    { label: "Investimento", value: "Investimento" },
  ];

  const opcoesSubcategoria: OpcaoComCategoria[] = [
    // Receita
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
    {
      label: "Serviços Diversos",
      value: "Serviços Diversos",
      categoria: "Receita",
    },
    {
      label: "Outras Receitas",
      value: "Outras Receitas",
      categoria: "Receita",
    },

    // Despesa
    { label: "Aluguel", value: "Aluguel", categoria: "Despesa" },
    {
      label: "Compra de Mercadorias / Insumos",
      value: "Compra de Mercadorias / Insumos",
      categoria: "Despesa",
    },
    {
      label: "Salários e Encargos",
      value: "Salários e Encargos",
      categoria: "Despesa",
    },
    {
      label: "Marketing e Divulgação",
      value: "Marketing e Divulgação",
      categoria: "Despesa",
    },
    {
      label: "Contas de Luz, Água, Telefone",
      value: "Contas de Luz, Água, Telefone",
      categoria: "Despesa",
    },
    {
      label: "Manutenção e Reparos",
      value: "Manutenção e Reparos",
      categoria: "Despesa",
    },
    {
      label: "Despesas Administrativas",
      value: "Despesas Administrativas",
      categoria: "Despesa",
    },
    {
      label: "Transporte e Frete",
      value: "Transporte e Frete",
      categoria: "Despesa",
    },
    {
      label: "Impostos e Taxas",
      value: "Impostos e Taxas",
      categoria: "Despesa",
    },
    {
      label: "Serviços Terceirizados",
      value: "Serviços Terceirizados",
      categoria: "Despesa",
    },
    {
      label: "Outras Despesas",
      value: "Outras Despesas",
      categoria: "Despesa",
    },

    // Investimento
    {
      label: "Compra de Equipamentos",
      value: "Compra de Equipamentos",
      categoria: "Investimento",
    },
    {
      label: "Reformas e Melhorias",
      value: "Reformas e Melhorias",
      categoria: "Investimento",
    },
    {
      label: "Treinamentos e Capacitação",
      value: "Treinamentos e Capacitação",
      categoria: "Investimento",
    },
    {
      label: "Desenvolvimento de Software / Sistemas",
      value: "Desenvolvimento de Software / Sistemas",
      categoria: "Investimento",
    },
    {
      label: "Aquisição de Veículos",
      value: "Aquisição de Veículos",
      categoria: "Investimento",
    },
    {
      label: "Outros Investimentos",
      value: "Outros Investimentos",
      categoria: "Investimento",
    },
  ];

  const opcoesFormaPagamento: Opcao[] = [
    { label: "Pix", value: "Pix" },
    { label: "Cartão de Crédito", value: "Cartão de Crédito" },
    { label: "Cartão de Débito", value: "Cartão de Débito" },
    { label: "Dinheiro", value: "Dinheiro" },
    { label: "Boleto", value: "Boleto" },
    { label: "Transferência Bancária", value: "Transferência Bancária" },
    { label: "Cheque", value: "Cheque" },
    { label: "Outros", value: "Outros" },
  ];

  const opcoesStatus: Opcao[] = [
    { label: "Pendente", value: "pendente" },
    { label: "Recebido", value: "recebido" },
    { label: "Pago", value: "pago" },
    { label: "Cancelado", value: "cancelado" },
  ];

  // Estados dos filtros
  const [filterCategoria, setFilterCategoria] = useState<string>("");
  const [filterSubcategoria, setFilterSubcategoria] = useState<string>("");

  const [filterFormaPagamento, setFilterFormaPagamento] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Subcategorias filtradas conforme categoria selecionada
  const subcategoriasFiltradas = filterCategoria
    ? opcoesSubcategoria.filter(
        (subcat) => subcat.categoria === filterCategoria
      )
    : [];

  // Filtra os dados com base nos filtros selecionados
  const filteredData = data.filter((item) => {
    return (
      (!filterCategoria || item.categoria === filterCategoria) &&
      (!filterSubcategoria || item.subcategoria === filterSubcategoria) &&
      (!filterFormaPagamento || item.formaPagamento === filterFormaPagamento) &&
      (!filterStatus || item.status === filterStatus)
    );
  });

  // Estados para modal e item selecionado (exemplo de edição)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editarSelecionado, setEditarSelecionado] = useState<any | null>(null);

  // Template para botão de ação (editar)
  const actionTemplate = (rowData: any) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setEditarSelecionado(rowData);
          setIsModalOpen(true);
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
    </div>
  );

  // Template para mostrar status com estilização (exemplo)
  const statusTemplate = (rowData: any) => {
    const status = rowData.status?.toLowerCase() || "indefinido";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status || "Indefinido"}
      </span>
    );
  };

  return (
    <div>
      <div className={styles["filters-container"]}>
        <FiltroDropdown
          value={filterCategoria}
          onChange={(val) => {
            setFilterCategoria(val);
            setFilterSubcategoria("");
          }}
          options={opcoesCategoria}
          label="Categoria"
          placeholder="Selecione uma categoria"
        />

        <FiltroDropdown
          value={filterSubcategoria}
          onChange={setFilterSubcategoria}
          options={subcategoriasFiltradas}
          label="Subcategoria"
          placeholder="Selecione subcategoria"
          disabled={!filterCategoria}
        />

        <FiltroDropdown
          value={filterFormaPagamento}
          onChange={setFilterFormaPagamento}
          options={opcoesFormaPagamento}
          label="Forma de Pagamento"
          placeholder="Selecione o pagamento"
        />

        <FiltroDropdown
          value={filterStatus}
          onChange={setFilterStatus}
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

      {isModalOpen && editarSelecionado && (
        <EditarFinanceiro
          registro={editarSelecionado} // passe o dado que quer editar
          onClose={() => {
            setIsModalOpen(false);
            setEditarSelecionado(null);
          }}
        />
      )}
    </div>
  );
}
