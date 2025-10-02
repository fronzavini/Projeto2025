"use client";
import { useState } from "react";
import styles from "../../styles/tabelas.module.css";

import { Filtros } from "../filtros";
import VisualizarFornecedor from "./visualizarFornecedor";
import EditarFornecedor from "./editarFornecedor";
import { deletarItem } from "../deletar";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TabelaFornecedores() {
  const dadosIniciais = [
    {
      id: 1,
      nome_empresa: "Floricultura Bela Rosa",
      cnpj: "12.345.678/0001-90",
      telefone: "(47) 99999-1111",
      email: "contato@belarosa.com",
      cep: "89000-100",
      logradouro: "Rua das Palmeiras",
      numero: "100",
      bairro: "Centro",
      complemento: "Sala 01",
      uf: "SC",
    },
    {
      id: 2,
      nome_empresa: "Verde & Vida Plantas",
      cnpj: "98.765.432/0001-80",
      telefone: "(47) 98888-2222",
      email: "vendas@verdevida.com",
      cep: "89000-200",
      logradouro: "Rua das Rosas",
      numero: "200",
      bairro: "Velha",
      complemento: "Loja 2",
      uf: "SC",
    },
    {
      id: 3,
      nome_empresa: "Mundo Floral LTDA",
      cnpj: "23.456.789/0001-77",
      telefone: "(47) 97777-3333",
      email: "mundo@floral.com.br",
      cep: "89000-300",
      logradouro: "Rua das Hortências",
      numero: "300",
      bairro: "Itoupava Norte",
      complemento: "",
      uf: "SC",
    },
    {
      id: 4,
      nome_empresa: "Rei das Flores",
      cnpj: "34.567.890/0001-66",
      telefone: "(47) 96666-4444",
      email: "atendimento@reidasflores.com",
      cep: "89000-400",
      logradouro: "Rua das Acácias",
      numero: "400",
      bairro: "Garcia",
      complemento: "Fundos",
      uf: "SC",
    },
    {
      id: 5,
      nome_empresa: "Jardim Encantado ME",
      cnpj: "45.678.901/0001-55",
      telefone: "(47) 95555-5555",
      email: "jardim@encantado.com",
      cep: "89000-500",
      logradouro: "Rua das Violetas",
      numero: "500",
      bairro: "Fortaleza",
      complemento: "Bloco B",
      uf: "SC",
    },
  ];

  const [dados, setDados] = useState(dadosIniciais);

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
        onClick={(e) => {
          e.stopPropagation();
          deletarItem({
            itemId: rowData.id,
            itemTipo: "Fornecedor",
            onDelete: () => {
              setDados((prev) => prev.filter((f) => f.id !== rowData.id));
            },
          });
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

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