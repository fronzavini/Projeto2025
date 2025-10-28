"use client";
import { useState, useEffect } from "react";
import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";
import styles from "../../styles/tabelas.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import EditarFornecedor from "./editarFornecedor";
import VisualizarFornecedor from "./visualizarFornecedor";


export default function TabelaFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);

  // Filtros
  const [filterId, setFilterId] = useState("");
  const [filterNome, setFilterNome] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterUf, setFilterUf] = useState("");

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fornecedorParaEditar, setFornecedorParaEditar] = useState(null);

  // Carregar fornecedores
  const carregarFornecedores = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_fornecedores");
      if (!res.ok) throw new Error("Erro ao carregar fornecedores");
      const data = await res.json();

      const lista = Array.isArray(data) ? data : data.detalhes || [];
      const formatados = lista.map(f => ({
        id: f[0],
        nome_empresa: f[1],
        cnpj: f[2],
        telefone: f[3],
        email: f[4],
        cep: f[5],
        logradouro: f[6],
        numero: f[7],
        bairro: f[8],
        complemento: f[9],
        uf: f[10],
        municipio: f[11],
      }));

      setFornecedores(formatados);
    } catch (err) {
      console.error(err);
      setFornecedores([]);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  // Dropdown UF
  const ufs = Array.from(new Set(fornecedores.map(f => f.uf))).map(v => ({ label: v, value: v }));

  // Filtro dos dados
  const filteredData = fornecedores.filter(f =>
    (!filterId || f.id.toString().startsWith(filterId)) &&
    (!filterNome || f.nome_empresa.toLowerCase().includes(filterNome.toLowerCase())) &&
    (!filterCnpj || f.cnpj.startsWith(filterCnpj)) &&
    (!filterUf || f.uf === filterUf)
  );

  // Ações da tabela
  const actionTemplate = (row) => (
    <div className={styles.acoes}>
      <button         className={styles.acaoBotao}
         onClick={(e) => { e.stopPropagation(); setFornecedorSelecionado(row); setIsModalOpen(true); }} title="Visualizar">
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <button         className={styles.acaoBotao}
         onClick={(e) => { e.stopPropagation(); setFornecedorParaEditar(row); setIsEditModalOpen(true); }} title="Editar">
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button         className={styles.acaoBotao}
        onClick={async (e) => {
        e.stopPropagation();
        if (!confirm(`Deseja excluir "${row.nome_empresa}"?`)) return;
        try {
          const res = await fetch(`http://localhost:5000/deletar_fornecedor/${row.id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Erro ao deletar");
          const result = await res.json();
          alert(result.message || "Fornecedor excluído");
          setFornecedores(prev => prev.filter(f => f.id !== row.id));
        } catch (err) {
          console.error(err);
          alert("Erro ao excluir fornecedor");
        }
      }} title="Excluir">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div>
      <div className={styles["filters-container"]}>
        <Filtros value={filterNome} onChange={setFilterNome} placeholder="Ex: ABC Ltda" label="Nome" />
        <Filtros value={filterId} onChange={setFilterId} placeholder="# 123" label="ID" />
        <Filtros value={filterCnpj} onChange={setFilterCnpj} placeholder="00.000.000/0000-00" label="CNPJ" />
        <FiltroDropdown value={filterUf} onChange={setFilterUf} options={ufs} placeholder="Todos" label="UF" />
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="nome_empresa" header="Nome" />
          <Column field="id" header="ID" />
          <Column field="cnpj" header="CNPJ" />
          <Column field="telefone" header="Telefone" />
          <Column field="email" header="Email" />
          <Column field="uf" header="UF" />
          <Column body={actionTemplate} header="Ações" style={{ width: 150 }} />
        </DataTable>

        {isModalOpen && fornecedorSelecionado && (
          <VisualizarFornecedor fornecedor={fornecedorSelecionado} onClose={() => { setIsModalOpen(false); setFornecedorSelecionado(null); }} />
        )}

        {isEditModalOpen && fornecedorParaEditar && (
          <EditarFornecedor fornecedor={fornecedorParaEditar} onClose={() => { setIsEditModalOpen(false); setFornecedorParaEditar(null); carregarFornecedores(); }} />
        )}
      </div>
    </div>
  );
}
