"use client";
import { useState } from "react";
import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";
import styles from "../../styles/tabelas.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faSearch,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import VisualizarOrcamento from "./visualizarOrcamento";
import EditarOrcamento from "./editarOrcamento";
import { cancelar } from "../cancelar";

export default function TabelaOrcamentos() {
  const data = [
    {
      idpedido: "10001",
      cpfcliente: "123.456.789-00",
      nomeCliente: "Cliente Exemplo 1",
      dataVenda: "2025-07-28",
      dataEntrega: "2025-08-01",
      formaEntrega: "Entrega",
      localEntrega: "Endereço Exemplo 1",
      valorTotal: "150.00",
      formaPagamento: "Pix",
      status: "Pendente",
      subtotal: "150.00",
      desconto: "0.00",
      itensVendidos: [
        {
          nome: "Produto Exemplo A",
          quantidade: 1,
          valorUnitario: "150.00",
          valorTotal: "150.00",
        },
      ],
      dataStatus: "",
    },
    {
      idpedido: "10002",
      cpfcliente: "987.654.321-00",
      nomeCliente: "Cliente Exemplo 2",
      dataVenda: "2025-07-29",
      dataEntrega: "2025-07-30",
      formaEntrega: "Retirada",
      localEntrega: "Loja Central",
      valorTotal: "200.00",
      formaPagamento: "Cartão de Crédito",
      status: "Retirado",
      subtotal: "200.00",
      desconto: "0.00",
      itensVendidos: [
        {
          nome: "Produto Exemplo B",
          quantidade: 2,
          valorUnitario: "100.00",
          valorTotal: "200.00",
        },
      ],
      dataStatus: "29/07/2025",
    },
    {
      idpedido: "10003",
      cpfcliente: "456.789.123-99",
      nomeCliente: "Cliente Exemplo 3",
      dataVenda: "2025-07-25",
      dataEntrega: "2025-07-27",
      formaEntrega: "Entrega",
      localEntrega: "Endereço Exemplo 3",
      valorTotal: "75.00",
      formaPagamento: "Dinheiro",
      status: "Cancelado",
      subtotal: "75.00",
      desconto: "0.00",
      itensVendidos: [
        {
          nome: "Produto Exemplo C",
          quantidade: 1,
          valorUnitario: "75.00",
          valorTotal: "75.00",
        },
      ],
      dataStatus: "27/07/2025",
    },
  ];

  const [orcamentos, setOrcamentos] = useState(data);

  const [filterNumeroPedido, setFilterNumeroPedido] = useState("");
  const [filterCpf, setFilterCpf] = useState("");
  const [filterDataEntrega, setFilterDataEntrega] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTipo, setFilterTipo] = useState("");

  const opcoesStatus = [
    { label: "Pendente", value: "Pendente" },
    { label: "Retirado", value: "Retirado" },
    { label: "Cancelado", value: "Cancelado" },
  ];

  const opcoesTipo = [
    { label: "Entrega", value: "Entrega" },
    { label: "Retirada", value: "Retirada" },
  ];

  const filteredData = orcamentos.filter((item) => {
    return (
      (!filterNumeroPedido || item.idpedido.startsWith(filterNumeroPedido)) &&
      (!filterCpf || item.cpfcliente.startsWith(filterCpf)) &&
      (!filterDataEntrega || item.dataEntrega === filterDataEntrega) &&
      (!filterStatus || item.status === filterStatus) &&
      (!filterTipo || item.formaEntrega === filterTipo)
    );
  });

  const statusTemplate = (rowData) => {
    const status = rowData.status?.toLowerCase() || "indefinido";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status || "Indefinido"}
        {rowData.dataStatus ? ` (${rowData.dataStatus})` : ""}
      </span>
    );
  };

  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [visualizarSelecionado, setVisualizarSelecionado] = useState(null);

  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [editarSelecionado, setEditarSelecionado] = useState(null);

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      {/* Marcar como entregue */}
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          cancelar({
            title: "Confirmar Orçamento",
            message: `Deseja confirmar o orçamento #${rowData.idpedido}?`,
            confirmLabel: "Sim, confirmar",
            confirmColor: "#28a745",
            onConfirm: () => {
              const dataAtual = new Date().toLocaleDateString("pt-BR");
              setOrcamentos((prev) =>
                prev.map((o) =>
                  o.idpedido === rowData.idpedido
                    ? { ...o, status: "Retirado", dataStatus: dataAtual }
                    : o
                )
              );
            },
          });
        }}
        title="Confirmar"
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>

      {/* Cancelar pedido */}
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          cancelar({
            title: "Cancelar Orçamento",
            message: `Deseja cancelar o orçamento #${rowData.idpedido}?`,
            confirmLabel: "Sim, cancelar",
            confirmColor: "#e53935",
            onConfirm: () => {
              const dataAtual = new Date().toLocaleDateString("pt-BR");
              setOrcamentos((prev) =>
                prev.map((o) =>
                  o.idpedido === rowData.idpedido
                    ? { ...o, status: "Cancelado", dataStatus: dataAtual }
                    : o
                )
              );
            },
          });
        }}
        title="Cancelar"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      {/* Editar */}
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setEditarSelecionado(rowData);
          setIsEditarModalOpen(true);
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>

      {/* Visualizar */}
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setVisualizarSelecionado(rowData);
          setIsVisualizarModalOpen(true);
        }}
        title="Visualizar"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );

  return (
    <div>
      {/* FILTROS */}
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filterNumeroPedido}
            onChange={setFilterNumeroPedido}
            placeholder="Filtre por número do pedido"
            label="Pedido"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterCpf}
            onChange={setFilterCpf}
            placeholder="Filtre por CPF"
            label="CPF"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterDataEntrega}
            onChange={setFilterDataEntrega}
            placeholder="Filtre por data de entrega"
            label="Data Entrega"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            options={opcoesStatus}
            placeholder="Selecione o status"
            label="Status"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterTipo}
            onChange={setFilterTipo}
            options={opcoesTipo}
            placeholder="Selecione o tipo"
            label="Tipo"
          />
        </div>
      </div>

      {/* TABELA */}
      <div className={styles["custom-table-cointainer"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="idpedido" header="Número do Pedido" />
          <Column field="cpfcliente" header="CPF Cliente" />
          <Column field="dataEntrega" header="Data da Entrega" />
          <Column field="dataVenda" header="Data do Orçamento" />
          <Column field="valorTotal" header="Valor Total" />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column field="formaEntrega" header="Entrega" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "180px" }}
          />
        </DataTable>

        {isVisualizarModalOpen && visualizarSelecionado && (
          <VisualizarOrcamento
            pedido={visualizarSelecionado}
            onClose={() => {
              setIsVisualizarModalOpen(false);
              setVisualizarSelecionado(null);
            }}
          />
        )}

        {isEditarModalOpen && editarSelecionado && (
          <EditarOrcamento
            orcamento={editarSelecionado}
            onClose={() => {
              setIsEditarModalOpen(false);
              setEditarSelecionado(null);
            }}
          />
        )}
      </div>
    </div>
  );
}