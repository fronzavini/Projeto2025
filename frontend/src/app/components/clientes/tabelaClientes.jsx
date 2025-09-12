"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/tabelas.module.css";
import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";

import VisualizarCliente from "./visualizarCliente";
import EditarCliente from "./editarCliente";
import { deletarItem } from "../deletar";

export default function TabelaClientes() {
  const [clientes, setClientes] = useState([]);

  const [filtros, setFiltros] = useState({
    id: "",
    cpf: "",
    nome: "",
    telefone: "",
    status: "",
  });

  const opcoesStatus = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [modalEditar, setModalEditar] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  // Carregar clientes
  const carregarClientes = async () => {
  try {
    const response = await fetch("http://localhost:5000/listar_clientes", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Erro ao carregar clientes.");

    const resultado = await response.json();
    console.log(resultado); // veja no console do navegador

    if (resultado.resultado === "ok") {
      const clientesFormatados = resultado.detalhes.map((c) => ({
        id: c[0],
        dataCadastro: c[1],
        nome: c[2],
        tipoPessoa: c[3],
        genero: c[4],
        cpf: c[5],
        rg: c[7],
        email: c[8],
        senha: c[9],
        telefone: c[10],
        dataNascimento: c[11],
        // estado: 1 = ativo, 0 = inativo
        status: c[12] === 1 ? "ativo" : "inativo",
        cep: c[13],
        logradouro: c[14],
        numero: c[15],
        bairro: c[16],
        complemento: c[17],
        uf: c[18],
        cidade: c[19],
      }));

      setClientes(clientesFormatados);
    }
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
  }
};

  useEffect(() => {
    carregarClientes();
  }, []);

  // Filtragem
  const filteredData = clientes.filter(
    (item) =>
      (!filtros.id || item.id.toString().startsWith(filtros.id)) &&
      (!filtros.cpf || item.cpf.startsWith(filtros.cpf)) &&
      (!filtros.nome ||
        item.nome.toLowerCase().startsWith(filtros.nome.toLowerCase())) &&
      (!filtros.telefone || item.telefone.startsWith(filtros.telefone)) &&
      (!filtros.status || item.status === filtros.status)
  );

  // Status template
  const statusTemplate = (rowData) => (
    <span
      className={`${styles["status-badge"]} ${
        styles[rowData.status?.toLowerCase() || "indefinido"]
      }`}
    >
      {rowData.status || "Indefinido"}
    </span>
  );

  // Ações
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setClienteSelecionado(rowData);
          setModalVisualizar(true);
        }}
        title="Visualizar"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>

      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setClienteParaEditar(rowData);
          setModalEditar(true);
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>

      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          // Chama função de deletar com SweetAlert
          deletarItem({
            itemId: rowData.id,
            itemTipo: "Cliente",
            onDelete: () => {
              setClientes((prev) => prev.filter((c) => c.id !== rowData.id));
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
      {/* Filtros */}
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.id}
            onChange={(v) => setFiltros({ ...filtros, id: v })}
            placeholder="Filtre por ID"
            label="ID"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.cpf}
            onChange={(v) => setFiltros({ ...filtros, cpf: v })}
            placeholder="Filtre por CPF"
            label="CPF"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.nome}
            onChange={(v) => setFiltros({ ...filtros, nome: v })}
            placeholder="Filtre por nome"
            label="Nome"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.telefone}
            onChange={(v) => setFiltros({ ...filtros, telefone: v })}
            placeholder="Filtre por telefone"
            label="Telefone"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filtros.status}
            onChange={(v) => setFiltros({ ...filtros, status: v })}
            options={opcoesStatus}
            placeholder="Selecione o status"
            label="Status"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="cpf" header="CPF" />
          <Column field="nome" header="Nome" />
          <Column field="telefone" header="Telefone" />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {/* Modais */}
        {modalVisualizar && clienteSelecionado && (
          <VisualizarCliente
            cliente={clienteSelecionado}
            onClose={() => {
              setModalVisualizar(false);
              setClienteSelecionado(null);
            }}
          />
        )}

        {modalEditar && clienteParaEditar && (
          <EditarCliente
            cliente={clienteParaEditar}
            onClose={() => {
              setModalEditar(false);
              setClienteParaEditar(null);
              carregarClientes();
            }}
          />
        )}
      </div>
    </div>
  );
}
