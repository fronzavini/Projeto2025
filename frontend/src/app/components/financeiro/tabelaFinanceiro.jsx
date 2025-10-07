"use client";
import styles from "../../styles/tabelas.module.css";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Filtros } from "../filtros";
import EditarFinanceiro from "./editarFinanceiro";
import { deletarItem } from "../deletar";

export default function TabelaFinanceiro() {
  const [dados, setDados] = useState([]);
  const [filterTipo, setFilterTipo] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transacaoParaEditar, setTransacaoParaEditar] = useState(null);

  const carregarTransacoes = async () => {
    try {
      const response = await fetch("http://localhost:5000/listar_transacaofinanceira");
      if (!response.ok) throw new Error("Erro ao carregar transações.");
      const resultado = await response.json();
      setDados(resultado);
    } catch (error) {
      alert("Erro ao carregar transações.");
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const filteredData = dados.filter(
    (item) =>
      (!filterTipo || item.tipo === filterTipo) &&
      (!filterCategoria || item.categoria === filterCategoria)
  );

  const handleDeleteTransacao = async (transacao) => {
    await deletarItem({
      itemId: transacao.id,
      itemTipo: "transação",
      onDelete: async () => {
        try {
          const resp = await fetch(
            `http://localhost:5000/deletar_transacaofinanceira/${transacao.id}`,
            { method: "DELETE" }
          );
          if (!resp.ok) throw new Error();
          setDados((prev) => prev.filter((d) => d.id !== transacao.id));
        } catch {
          alert("Erro ao deletar transação.");
        }
      },
    });
  };

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setTransacaoParaEditar(rowData);
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
          handleDeleteTransacao(rowData);
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
            value={filterTipo}
            onChange={setFilterTipo}
            placeholder="Tipo"
            label="Tipo"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterCategoria}
            onChange={setFilterCategoria}
            placeholder="Categoria"
            label="Categoria"
          />
        </div>
      </div>
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="tipo" header="Tipo" />
          <Column field="categoria" header="Categoria" />
          <Column field="descricao" header="Descrição" />
          <Column field="valor" header="Valor" />
          <Column field="data" header="Data" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "120px" }}
          />
        </DataTable>
        {isEditModalOpen && transacaoParaEditar && (
          <EditarFinanceiro
            transacao={transacaoParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setTransacaoParaEditar(null);
              carregarTransacoes();
            }}
          />
        )}
      </div>
    </div>
  );
}