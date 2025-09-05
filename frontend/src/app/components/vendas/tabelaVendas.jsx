"use client";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";
import VisualizarPedido from "./visualizarPedido";
import styles from "../../styles/tabelas.module.css";

export default function TabelaVendas() {
  const data = [
    {
      idpedido: "101",
      cpfcliente: "123.456.789-00",
      nomeCliente: "Felipe Vieira Rocha",
      dataVenda: "2025-07-20",
      dataEntrega: "2025-07-25",
      formaEntrega: "retirada",
      localEntrega: "Loja Central",
      valorTotal: "150.75",
      formaPagamento: "Pix",
      status: "Pendente",
      subtotal: "150.75",
      desconto: "0.00",
      itensVendidos: [
        {
          nome: "Buquê de Rosas Vermelhas",
          quantidade: 1,
          valorUnitario: "150.75",
          valorTotal: "150.75",
        },
      ],
    },
    {
      idpedido: "102",
      cpfcliente: "987.654.321-11",
      nomeCliente: "Ana Beatriz Lima",
      dataVenda: "2025-07-22",
      dataEntrega: "2025-07-27",
      formaEntrega: "entrega",
      localEntrega: "Rua das Flores, 123",
      valorTotal: "320.00",
      formaPagamento: "Cartão de Crédito",
      status: "Pago",
      subtotal: "340.00",
      desconto: "20.00",
      itensVendidos: [
        {
          nome: "Orquídea Branca",
          quantidade: 2,
          valorUnitario: "170.00",
          valorTotal: "340.00",
        },
      ],
    },
    {
      idpedido: "103",
      cpfcliente: "555.666.777-88",
      nomeCliente: "João Pedro Souza",
      dataVenda: "2025-07-23",
      dataEntrega: "2025-07-29",
      formaEntrega: "retirada",
      localEntrega: "Quiosque Blumenau",
      valorTotal: "45.50",
      formaPagamento: "Dinheiro",
      status: "Cancelado",
      subtotal: "45.50",
      desconto: "0.00",
      itensVendidos: [
        {
          nome: "Adubo Orgânico 1kg",
          quantidade: 1,
          valorUnitario: "45.50",
          valorTotal: "45.50",
        },
      ],
    },
    {
      idpedido: "104",
      cpfcliente: "222.333.444-55",
      nomeCliente: "Laura Menezes",
      dataVenda: "2025-07-24",
      dataEntrega: "2025-07-30",
      formaEntrega: "entrega",
      localEntrega: "Av. Botânica, 456",
      valorTotal: "280.00",
      formaPagamento: "Pix",
      status: "Entregue",
      subtotal: "300.00",
      desconto: "20.00",
      itensVendidos: [
        {
          nome: "Vaso Cerâmico Branco",
          quantidade: 2,
          valorUnitario: "150.00",
          valorTotal: "300.00",
        },
      ],
    },
    {
      idpedido: "105",
      cpfcliente: "999.888.777-66",
      nomeCliente: "Bruno Castro",
      dataVenda: "2025-07-25",
      dataEntrega: "2025-07-31",
      formaEntrega: "retirada",
      localEntrega: "Loja Shopping Norte",
      valorTotal: "120.00",
      formaPagamento: "Cartão de Débito",
      status: "Pendente",
      subtotal: "120.00",
      desconto: "0.00",
      itensVendidos: [
        {
          nome: "Rosa do Deserto",
          quantidade: 1,
          valorUnitario: "120.00",
          valorTotal: "120.00",
        },
      ],
    },
  ];

  // Estados dos filtros
  const [filterDataVenda, setFilterDataVenda] = useState("");
  const [filterDataEntrega, setFilterDataEntrega] = useState("");
  const [filterEntrega, setFilterEntrega] = useState("");
  const [filterID, setFilterID] = useState("");
  const [filterCliente, setFilterCliente] = useState("");

  const opcoesEntregas = [
    { label: "Retirada", value: "retirada" },
    { label: "Entrega", value: "entrega" },
  ];

  // Dados filtrados com base nos filtros
  const filteredData = data.filter((item) => {
    const dataVendaStr = item.dataVenda
      ? new Date(item.dataVenda).toISOString().slice(0, 10)
      : "";
    const dataEntregaStr = item.dataEntrega
      ? new Date(item.dataEntrega).toISOString().slice(0, 10)
      : "";
    const idStr = item.idpedido ? item.idpedido.toString() : "";
    const clienteCPFStr = item.cpfcliente ? item.cpfcliente.toLowerCase() : "";
    const clienteNomeStr = item.nomeCliente
      ? item.nomeCliente.toLowerCase()
      : "";

    return (
      (!filterDataVenda || dataVendaStr.startsWith(filterDataVenda)) &&
      (!filterDataEntrega || dataEntregaStr.startsWith(filterDataEntrega)) &&
      (!filterEntrega || item.formaEntrega === filterEntrega) &&
      (!filterID || idStr.includes(filterID)) &&
      (!filterCliente ||
        clienteCPFStr.includes(filterCliente.toLowerCase()) ||
        clienteNomeStr.includes(filterCliente.toLowerCase()))
    );
  });

  // Modal para visualizar pedido
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // Botão ação "Visualizar"
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
    </div>
  );

  return (
    <div>
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filterID}
            onChange={setFilterID}
            placeholder="#101"
            label="ID Pedido"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterCliente}
            onChange={setFilterCliente}
            placeholder="CPF ou nome do cliente"
            label="Cliente"
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
        <div className={styles.filtro}>
          <Filtros
            type="date"
            value={filterDataEntrega}
            onChange={setFilterDataEntrega}
            label="Data Entrega"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterEntrega}
            onChange={setFilterEntrega}
            options={opcoesEntregas}
            placeholder="Todos"
            label="Forma de Entrega"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="idpedido" header="ID Pedido" />
          <Column field="cpfcliente" header="CPF Cliente" />
          <Column
            field="dataVenda"
            header="Data Venda"
            body={(rowData) =>
              new Date(rowData.dataVenda).toLocaleDateString("pt-BR")
            }
          />
          <Column
            field="dataEntrega"
            header="Data Entrega"
            body={(rowData) =>
              new Date(rowData.dataEntrega).toLocaleDateString("pt-BR")
            }
          />
          <Column
            field="formaEntrega"
            header="Forma de Entrega"
            body={(rowData) =>
              rowData.formaEntrega.charAt(0).toUpperCase() +
              rowData.formaEntrega.slice(1)
            }
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
