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

import { cancelar } from "../cancelar";
import VisualizarEncomenda from "./visualizarEncomenda";
import EditarEncomenda from "./editarEncomenda";

export default function TabelaEncomendas() {
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
    },
  ];

  // Filtros
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

  const filteredData = data.filter(
    (item) =>
      (!filterNumeroPedido || item.idpedido.startsWith(filterNumeroPedido)) &&
      (!filterCpf || item.cpfcliente.startsWith(filterCpf)) &&
      (!filterDataEntrega || item.dataEntrega === filterDataEntrega) &&
      (!filterStatus || item.status === filterStatus) &&
      (!filterTipo || item.formaEntrega === filterTipo)
  );

  const statusTemplate = (rowData) => {
    const status = rowData.status?.toLowerCase() || "indefinido";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status}
      </span>
    );
  };

  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [visualizarSelecionado, setVisualizarSelecionado] = useState(null);

  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [editarSelecionado, setEditarSelecionado] = useState(null);

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          cancelar({
            title: "Confirmar Encomenda",
            message: "Confirmar a encomenda",
            itemId: rowData.idpedido,
            confirmLabel: "Confirmar",
            confirmColor: "#37966F",
            onConfirm: () =>
              console.log(`Pedido ${rowData.idpedido} confirmado`),
          });
        }}
        title="Entregue"
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>

      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          cancelar({
            title: "Cancelar Pedido",
            message: "Tem certeza que deseja CANCELAR a encomenda",
            itemId: rowData.idpedido,
            confirmLabel: "Cancelar encomenda",
            confirmColor: "#e53935",
            onConfirm: () =>
              console.log(`Encomenda ${rowData.idpedido} CANCELADA`),
          });
        }}
        title="Cancelado"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

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
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filterNumeroPedido}
            onChange={setFilterNumeroPedido}
            placeholder="#1234"
            label="Número Pedido"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterCpf}
            onChange={setFilterCpf}
            placeholder="111.222.333-44"
            label="CPF"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterDataEntrega}
            onChange={setFilterDataEntrega}
            placeholder="2000-11-22"
            label="Data de entrega"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            options={opcoesStatus}
            placeholder="Selecione o Status"
            label="Status"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterTipo}
            onChange={setFilterTipo}
            options={opcoesTipo}
            placeholder="Selecione o Tipo"
            label="Tipo"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="idpedido" header="Número do Pedido" />
          <Column field="cpfcliente" header="CPF Cliente" />
          <Column field="dataEntrega" header="Data da Entrega" />
          <Column field="dataVenda" header="Data da Venda" />
          <Column field="valorTotal" header="Valor Total" />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column field="formaEntrega" header="Entrega" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {isVisualizarModalOpen && visualizarSelecionado && (
          <VisualizarEncomenda
            pedido={visualizarSelecionado}
            onClose={() => {
              setIsVisualizarModalOpen(false);
              setVisualizarSelecionado(null);
            }}
          />
        )}

        {isEditarModalOpen && editarSelecionado && (
          <EditarEncomenda
            encomenda={editarSelecionado}
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
