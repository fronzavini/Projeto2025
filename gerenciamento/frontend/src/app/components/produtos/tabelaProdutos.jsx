"use client";
import { useState, useEffect } from "react";
import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";
import styles from "../../styles/tabelas.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import VisualizarProduto from "./visualizarProdutos";
import EditarProduto from "./editarProduto";

export default function TabelaProduto() {
  const [produtos, setProdutos] = useState([]);

  // Estados dos filtros
  const [filterId, setFilterId] = useState("");
  const [filterNome, setFilterNome] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const opcoesStatus = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  // Modal e produto selecionado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);

  // Carregar produtos do backend
  const carregarProdutos = async () => {
    try {
      const response = await fetch("http://192.168.18.155:5000/listar_produtos", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Erro ao carregar produtos.");
      const resultado = await response.json();

      // Mapear corretamente todas as colunas e imagens
      const produtosFormatados = (Array.isArray(resultado) ? resultado : []).map((p) => ({
        id: p[0],
        nome: p[1],
        categoria: p[2],
        marca: p[3],
        preco: Number(p[4]),
        quantidade_estoque: p[5],
        estoque_minimo: p[6],
        estado: p[7],
        fornecedor_id: p[8],
        imagens: [p[9], p[10], p[11]].filter(Boolean), // todas as imagens não nulas
        imagem: p[9] || p[10] || p[11] || "", // primeira imagem disponível
      }));

      setProdutos(produtosFormatados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProdutos([]);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Criar filtros dinâmicos
  const tipos = Array.from(new Set(produtos.map((d) => d.marca))).map((v) => ({
    label: v,
    value: v,
  }));
  const categorias = Array.from(new Set(produtos.map((d) => d.categoria))).map((v) => ({
    label: v,
    value: v,
  }));

  const filteredData = produtos.filter((item) => {
    const statusStr = item.estado ? "ativo" : "inativo";
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterNome || item.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
      (!filterTipo || item.marca === filterTipo) &&
      (!filterCategoria || item.categoria === filterCategoria) &&
      (!filterStatus || statusStr === filterStatus)
    );
  });

  const statusTemplate = (rowData) => {
    const status = rowData.estado ? "ativo" : "inativo";
    return <span className={`${styles["status-badge"]} ${styles[status]}`}>{status}</span>;
  };

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
        onClick={async (e) => {
          e.stopPropagation();
          if (!confirm(`Deseja realmente deletar o produto "${rowData.nome}"?`)) return;

          try {
            const response = await fetch(
              `http://192.168.18.155:5000/deletar_produto/${rowData.id}`,
              { method: "DELETE" }
            );

            if (!response.ok) throw new Error("Erro ao deletar produto.");

            const result = await response.json();
            alert(result.message || "Produto deletado com sucesso!");
            setProdutos((prev) => prev.filter((p) => p.id !== rowData.id));
          } catch (error) {
            console.error("Erro ao deletar produto:", error);
            alert("Erro ao deletar produto.");
          }
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
        <Filtros value={filterNome} onChange={setFilterNome} placeholder="Ex: Rosa" label="Nome" />
        <Filtros value={filterId} onChange={setFilterId} placeholder="# 12345" label="ID Produto" />
        <FiltroDropdown value={filterTipo} onChange={setFilterTipo} options={tipos} placeholder="Todos" label="Tipo" />
        <FiltroDropdown value={filterCategoria} onChange={setFilterCategoria} options={categorias} placeholder="Todos" label="Categoria" />
        <FiltroDropdown value={filterStatus} onChange={setFilterStatus} options={opcoesStatus} placeholder="Todos" label="Status" />
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column
            field="imagem"
            header="Imagem"
            body={(rowData) => (
              <div style={{ display: "flex", gap: 4 }}>
                {rowData.imagens && rowData.imagens.length > 0 ? (
                  rowData.imagens.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={rowData.nome}
                      data-prod-id={rowData.id}          // <<-- aqui
                      data-img-index={idx}               // <<-- e aqui
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                    />
                  ))
                ) : (
                  <span>Sem imagem</span>
                )}
              </div>
            )}
          />

          <Column field="nome" header="Nome" />
          <Column field="id" header="ID" />
          <Column field="marca" header="Tipo" />
          <Column field="categoria" header="Categoria" />
          <Column
            field="preco"
            header="Valor"
            body={(rowData) => `R$ ${parseFloat(rowData.preco || 0).toFixed(2)}`}
          />
          <Column field="estado" header="Status" body={statusTemplate} />
          <Column body={actionTemplate} header="Ações" style={{ width: 150 }} />
        </DataTable>

        {isModalOpen && produtoSelecionado && (
          <VisualizarProduto
            produto={produtoSelecionado}
            onClose={() => { setIsModalOpen(false); setProdutoSelecionado(null); carregarProdutos(); }}
          />
        )}

        {isEditModalOpen && produtoParaEditar && (
          <EditarProduto
            produto={produtoParaEditar}
            onClose={() => { setIsEditModalOpen(false); setProdutoParaEditar(null); carregarProdutos(); }}
          />
        )}
      </div>
    </div>
  );
}
