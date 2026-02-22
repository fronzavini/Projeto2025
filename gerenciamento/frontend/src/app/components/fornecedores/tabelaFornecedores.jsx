"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/tabelas.module.css";

import { Filtros } from "../filtros";
import VisualizarFornecedor from "./visualizarFornecedor";
import EditarFornecedor from "./editarFornecedor";
// usamos as rotas do backend diretamente

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TabelaFornecedores() {
  const [dados, setDados] = useState([]);

  // filtros
  const [filterId, setFilterId] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterNome, setFilterNome] = useState("");

  const filteredData = dados.filter((item) => {
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterCnpj || item.cnpj.startsWith(filterCnpj)) &&
      (!filterNome ||
        item.nome_empresa.toLowerCase().startsWith(filterNome.toLowerCase()))
    );
  });

  // modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fornecedorParaEditar, setFornecedorParaEditar] = useState(null);

  // template das ações
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setFornecedorSelecionado(rowData);
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
          setFornecedorParaEditar(rowData);
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
          if (!confirm(`Deseja realmente deletar o fornecedor "${rowData.nome_empresa}"?`)) return;

          try {
            const res = await fetch(`http://191.52.6.89:5000/deletar_fornecedor/${rowData.id}`, {
              method: "DELETE",
            });

            if (!res.ok) throw new Error("Erro ao deletar fornecedor.");

            const result = await res.json();    
            alert(result.message || "Fornecedor deletado com sucesso!");
            setDados((prev) => prev.filter((f) => f.id !== rowData.id));
          } catch (err) {
            console.error("Erro ao deletar fornecedor:", err);
            alert("Erro ao deletar fornecedor.");
          }
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  // carregar fornecedores do backend
  // carregar fornecedores do backend
const carregarFornecedores = async () => {
  try {
    const res = await fetch("http://191.52.6.89:5000/listar_fornecedores", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Erro ao carregar fornecedores");

    const resultado = await res.json();

    // AJUSTE COMPLETO DE NOMENCLATURA
    const fornecedoresFormatados = (resultado || []).map((f) => {
      // Se o backend retornar linhas como arrays (tuplas), mapear por índices
      if (Array.isArray(f)) {
        // ordem na tabela: id, nome_empresa, cnpj, telefone, email, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio
        return {
          id: f[0],
          nome_empresa: f[1],
          cnpj: f[2],
          telefone: f[3],
          email: f[4],
          endCep: f[5],
          endRua: f[6],
          endNumero: f[7],
          endBairro: f[8],
          endComplemento: f[9],
          endUF: f[10],
          endMunicipio: f[11],
          // nomes usados pelos modais
          cep: f[5] || "",
          logradouro: f[6] || "",
          numero: f[7] || "",
          bairro: f[8] || "",
          complemento: f[9] || "",
          cidade: f[11] || "",
          uf: f[10] || "",
        };
      }

      // Caso o backend já retorne objetos com nomes, usar propriedades
      return {
        id: f.id ?? f[0],
        nome_empresa: f.nome_empresa ?? f.nome ?? "",
        cnpj: f.cnpj ?? "",
        telefone:   f.telefone ?? "",
        email: f.email ?? "",
        endCep: f.endCep ?? f.cep ?? "",
        endRua: f.endRua ?? f.logradouro ?? "",
        endNumero: f.endNumero ?? f.numero ?? "",
        endBairro: f.endBairro ?? f.bairro ?? "",
        endComplemento: f.endComplemento ?? f.complemento ?? "",
        endUF: f.endUF ?? f.uf ?? "",
        endMunicipio: f.endMunicipio ?? f.cidade ?? "",
        cep: f.endCep ?? f.cep ?? "",
        logradouro: f.endRua ?? f.logradouro ?? "",
        numero: f.endNumero ?? f.numero ?? "",
        bairro: f.endBairro ?? f.bairro ?? "",
        complemento: f.endComplemento ?? f.complemento ?? "",
        cidade: f.endMunicipio ?? f.cidade ?? "",
        uf: f.endUF ?? f.uf ?? "",
      };
    });

    setDados(fornecedoresFormatados);
  } catch (err) {
    console.error("Erro ao carregar fornecedores:", err);
    setDados([]);
  }
};

  // carregar fornecedores ao montar o componente
  useEffect(() => {
    carregarFornecedores();
  }, []);

  return (
    <div>
      {/* filtros */}
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filterId}
            onChange={setFilterId}
            placeholder="Filtre por ID"
            label="ID"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterCnpj}
            onChange={setFilterCnpj}
            placeholder="Filtre por CNPJ"
            label="CNPJ"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterNome}
            onChange={setFilterNome}
            placeholder="Filtre por nome"
            label="Nome"
          />
        </div>
      </div>

      {/* tabela */}
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="cnpj" header="CNPJ" />
          <Column field="nome_empresa" header="Nome" />
          <Column field="email" header="Email" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {/* modais */}
        {isModalOpen && fornecedorSelecionado && (
          <VisualizarFornecedor
            fornecedor={fornecedorSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setFornecedorSelecionado(null);
            }}
          />
        )}

        {isEditModalOpen && fornecedorParaEditar && (
          <EditarFornecedor
            fornecedor={fornecedorParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setFornecedorParaEditar(null);
            }}
          />
        )}
      </div>
    </div>
  );
}