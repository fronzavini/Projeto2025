import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/tabelas.module.css";
import { FiltroDropdown } from "../filtrosDropdown";
import EditarFinanceiro from "./editarFinanceiro";

export default function TabelaFinanceiro() {
  const [transacoes, setTransacoes] = useState([]);

  const carregarTransacoes = async () => {
    try {
      const res = await fetch(
        "http://192.168.18.155:5000/listar_transacaofinanceira",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("Erro ao carregar transações");

      const resultado = await res.json();

      const transacoesFormatadas = (resultado || []).map((t) => ({
        id: t[0],
        data: t[1],
        tipo: t[2],
        categoria: t[3],
        descricao: t[4],
        // garantir que `valor` seja número (pode vir como string/Decimal)
        valor: (() => {
          const v = t[5];
          const num = typeof v === "number" ? v : Number(v);
          return Number.isFinite(num) ? num : 0;
        })(),
      }));

      setTransacoes(transacoesFormatadas);
    } catch (err) {
      console.error("Erro ao carregar transações:", err);
      setTransacoes([]);
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const opcoesTipo = [
    { label: "Entrada", value: "entrada" },
    { label: "Saída", value: "saida" },
  ];

  const opcoesCategoria = [
    { label: "Venda", value: "venda" },
    { label: "Aluguel", value: "aluguel" },
    { label: "Compra de Insumos", value: "compra_insumos" },
    { label: "Marketing", value: "marketing" },
    { label: "Serviço", value: "servico" },
    { label: "Equipamentos", value: "equipamentos" },
    { label: "Outro", value: "outro" },
  ];

  // Estado unificado de filtros
  const [filters, setFilters] = useState({
    tipo: "",
    categoria: "",
  });

  // Modal de edição
  const [modalEditar, setModalEditar] = useState({
    open: false,
    registro: null,
  });

  const filteredData = transacoes.filter(
    (item) =>
      (!filters.tipo || item.tipo === filters.tipo) &&
      (!filters.categoria || item.categoria === filters.categoria),
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
      <button
        className={styles.acaoBotao}
        onClick={async (e) => {
          e.stopPropagation();
          if (!confirm("Deseja realmente deletar esta transação?")) return;
          try {
            const res = await fetch(
              `http:192.168.18.155:5000/deletar_transacaofinanceira/${rowData.id}`,
              { method: "DELETE" },
            );
            if (!res.ok) throw new Error("Erro ao deletar");
            alert("Transação deletada com sucesso!");
            setTransacoes((prev) => prev.filter((t) => t.id !== rowData.id));
          } catch (err) {
            console.error("Erro:", err);
            alert("Erro ao deletar transação.");
          }
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
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
          value={filters.tipo}
          onChange={(val) => setFilters({ ...filters, tipo: val })}
          options={opcoesTipo}
          label="Tipo"
          placeholder="Selecione tipo"
        />

        <FiltroDropdown
          value={filters.categoria}
          onChange={(val) => setFilters({ ...filters, categoria: val })}
          options={opcoesCategoria}
          label="Categoria"
          placeholder="Selecione uma categoria"
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
        <Column field="tipo" header="Tipo" />
        <Column field="categoria" header="Categoria" />
        <Column field="descricao" header="Descrição" />
        <Column
          field="valor"
          header="Valor"
          body={(row) => `R$${row.valor ? row.valor.toFixed(2) : "0.00"}`}
        />
        <Column
          body={actionTemplate}
          header="Ações"
          style={{ width: "100px" }}
        />
      </DataTable>

      {modalEditar.open && modalEditar.registro && (
        <EditarFinanceiro
          registro={modalEditar.registro}
          onClose={() => {
            setModalEditar({ open: false, registro: null });
            carregarTransacoes();
          }}
        />
      )}
    </div>
  );
}
