import styles from "../styles/tabelas.module.css";

import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";
import type { Opcao } from "./FiltrosDropdown";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Button } from "primereact/button";
import SaidaEstoque from "./SaidaEstoque";
import EntradaEstoque from "./EntradaEstoque";

export default function TabelaEstoque() {
  const data = [
    {
      id: 1,
      produto: "Buquê de Rosas Vermelhas",
      quantidade_atual: 15,
      status: "disponivel",
      ultima_movimentacao: "2025-07-10T14:30:00",
    },
    {
      id: 2,
      produto: "Orquídea Branca",
      quantidade_atual: 8,
      status: "baixo",
      ultima_movimentacao: "2025-07-12T10:45:00",
    },
    {
      id: 3,
      produto: "Arranjo de Flores do Campo",
      quantidade_atual: 0,
      status: "esgotado",
      ultima_movimentacao: "2025-06-30T17:20:00",
    },
    {
      id: 4,
      produto: "Mini Cacto Decorativo",
      quantidade_atual: 40,
      status: "disponivel",
      ultima_movimentacao: "2025-07-15T09:10:00",
    },
    {
      id: 5,
      produto: "Vaso de Suculentas Mistas",
      quantidade_atual: 5,
      status: "baixo",
      ultima_movimentacao: "2025-07-13T11:00:00",
    },
  ];

  const [filterId, setFilterId] = useState<string>("");
  const [filterProduto, setFilterProduto] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const opcoes: Opcao[] = [
    { label: "Disponível", value: "disponivel" },
    { label: "Baixo", value: "baixo" },
    { label: "Esgotado", value: "esgotado" },
  ];

  const filteredData = data.filter((item) => {
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterProduto ||
        item.produto.toLowerCase().startsWith(filterProduto.toLowerCase())) &&
      (!filterStatus || item.status === filterStatus)
    );
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saidaSelecionado, setSaidaSelecionado] = useState<any | null>(null);

  const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
  const [entradaSelecionado, setEntradaSelecionado] = useState<any | null>(
    null
  );

  const statusTemplate = (rowData: any) => {
    const status = rowData.status?.toLowerCase() || "indefinido";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status || "Indefinido"}
      </span>
    );
  };

  const actionTemplate = (rowData: any) => {
    return (
      <div className={styles.acoes}>
        <Button
          className={styles.acaoBotao}
          onClick={(e) => {
            e.stopPropagation();
            setEntradaSelecionado(rowData);
            setIsEntradaModalOpen(true);
          }}
          title="Entrada"
        >
          Registrar Entrada
        </Button>

        <Button
          className={styles.acaoBotao}
          onClick={(e) => {
            e.stopPropagation();
            setSaidaSelecionado(rowData);
            setIsModalOpen(true);
          }}
          title="Saída"
        >
          Registrar Saída
        </Button>
      </div>
    );
  };

  return (
    <div>
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            options={opcoes}
            placeholder="Selecione o status"
            label="Status"
          />
        </div>

        <div className={styles.filtro}>
          <Filtros
            value={filterProduto}
            onChange={setFilterProduto}
            placeholder="Filtre por produto"
            label="Nome"
          />
        </div>

        <div className={styles.filtro}>
          <Filtros
            value={filterId}
            onChange={setFilterId}
            placeholder="Filtre por Id"
            label="ID"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="produto" header="Produto" />
          <Column field="id" header="ID" />
          <Column field="quantidade_atual" header="Quantidade Atual" />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column field="ultima_movimentacao" header="Última Movimentação" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {isModalOpen && saidaSelecionado && (
          <SaidaEstoque
            estoqueId={saidaSelecionado.id.toString()}
            onClose={() => {
              setIsModalOpen(false);
              setSaidaSelecionado(null);
            }}
          />
        )}

        {isEntradaModalOpen && entradaSelecionado && (
          <EntradaEstoque
            estoqueId={entradaSelecionado.id.toString()}
            onClose={() => {
              setIsEntradaModalOpen(false);
              setEntradaSelecionado(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
