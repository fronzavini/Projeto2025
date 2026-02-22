"use client";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import styles from "../../styles/tabelas.module.css";
import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";
import SaidaEstoque from "./saidaEstoque";
import EntradaEstoque from "./entradaEstoque";

export default function TabelaEstoque() {
  const [produtos, setProdutos] = useState([]);

  const [filterId, setFilterId] = useState("");
  const [filterProduto, setFilterProduto] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const opcoesStatus = [
    { label: "Disponível", value: "disponivel" },
    { label: "Baixo", value: "baixo" },
    { label: "Esgotado", value: "esgotado" },
  ];

  // carregar produtos do backend
  const carregarProdutos = async () => {
    try {
      const res = await fetch("http://191.52.6.89:5000/listar_produtos", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erro ao carregar produtos");

      const resultado = await res.json();

      // Mapeia produtos do backend (tuplas) para objeto com status dinâmico
      const produtosFormatados = (resultado || []).map((p) => {
        // tabela produtos: id, nome, categoria, marca, preco, quantidade_estoque, estoque_minimo, estado, fornecedor_id
        const preco = Number(p[4]) || 0; // índice do preco
        const quantidadeEstoque = Number(p[5]) || 0; // índice da quantidade_estoque
        let status = "disponivel";
        if (quantidadeEstoque === 0) {
          status = "esgotado";
        } else if (quantidadeEstoque <= 10) {
          status = "baixo";
        }

        return {
          id: p[0],
          nome: p[1],
          categoria: p[2],
          marca: p[3],
          preco: preco,
          quantidade_estoque: quantidadeEstoque,
          status,
          ultima_movimentacao: new Date().toISOString(),
        };
      });

      setProdutos(produtosFormatados);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setProdutos([]);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const filteredData = produtos.filter(
    (item) =>
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterProduto ||
        item.nome.toLowerCase().startsWith(filterProduto.toLowerCase())) &&
      (!filterStatus || item.status === filterStatus)
  );

  const [saidaModal, setSaidaModal] = useState({ open: false, item: null });
  const [entradaModal, setEntradaModal] = useState({ open: false, item: null });

  const statusTemplate = (rowData) => {
    const status = rowData.status?.toLowerCase() || "indefinido";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status}
      </span>
    );
  };

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <Button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setEntradaModal({ open: true, item: rowData });
        }}
        title="Entrada"
      >
        Registrar Entrada
      </Button>
      <Button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setSaidaModal({ open: true, item: rowData });
        }}
        title="Saída"
      >
        Registrar Saída
      </Button>
    </div>
  );

  return (
    <div>
      <div className={styles["filters-container"]}>
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
          <Column field="nome" header="Produto" />
          <Column field="id" header="ID" />
          <Column field="quantidade_estoque" header="Quantidade Atual" />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column field="ultima_movimentacao" header="Última Movimentação" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "200px" }}
          />
        </DataTable>

        {saidaModal.open && saidaModal.item && (
          <SaidaEstoque
            produto={saidaModal.item}
            onClose={() => setSaidaModal({ open: false, item: null })}
          />
        )}

        {entradaModal.open && entradaModal.item && (
          <EntradaEstoque
            produto={entradaModal.item}
            onClose={() => setEntradaModal({ open: false, item: null })}
          />
        )}
      </div>
    </div>
  );
}