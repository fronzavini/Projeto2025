import styles from "../styles/tabelas.module.css";

import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";
import type { Opcao } from "./FiltrosDropdown";
import VisualizarCliente from "./VisualizarCliente";
import EditarCliente from "./EditarCliente";
import DeletarCliente from "./DeletarCliente";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function TabelaClientes() {
  const [clientes, setClientes] = useState<any[]>([]);

  // Função para carregar clientes do backend
  async function carregarClientes() {
    try {
      const response = await fetch("http://localhost:5000/listar_clientes");
      const resultado = await response.json();
      if (resultado.resultado === "ok") {
        const clientesFormatados = resultado.detalhes.map((c: any) => ({
          ...c,
          status: c.estado ? "ativo" : "inativo",
        }));
        setClientes(clientesFormatados);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  // Estados dos filtros
  const [filterId, setFilterId] = useState<string>("");
  const [filterCpf, setFilterCpf] = useState<string>("");
  const [filterNome, setFilterNome] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterTelefone, setFilterTelefone] = useState<string>("");

  const opcoes: Opcao[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  // Dados filtrados conforme filtros aplicados
  const filteredData = clientes.filter((item) => {
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterCpf || item.cpf.startsWith(filterCpf)) &&
      (!filterNome ||
        item.nome.toLowerCase().startsWith(filterNome.toLowerCase())) &&
      (!filterTelefone || item.telefone.startsWith(filterTelefone)) &&
      (!filterStatus || item.status === filterStatus)
    );
  });

  // Template para status com estilos
  const statusTemplate = (rowData: any) => {
    const status = rowData.status?.toLowerCase() || "indefinido";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status || "Indefinido"}
      </span>
    );
  };

  // Estados para modais e cliente selecionado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<any | null>(
    null
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<any | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<any | null>(
    null
  );

  // Template para ações (visualizar, editar, deletar)
  const actionTemplate = (rowData: any) => {
    return (
      <div className={styles.acoes}>
        <button
          className={styles.acaoBotao}
          onClick={(e) => {
            e.stopPropagation();
            setClienteSelecionado(rowData);
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
            setClienteParaEditar(rowData);
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
            setClienteParaExcluir(rowData);
            setIsDeleteModalOpen(true);
          }}
          title="Excluir"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    );
  };

  function fecharModalExcluir() {
    setIsDeleteModalOpen(false);
    setClienteParaExcluir(null);
  }

  return (
    <div>
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
            value={filterCpf}
            onChange={setFilterCpf}
            placeholder="Filtre por CPF"
            label="CPF"
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
        <div className={styles.filtro}>
          <Filtros
            value={filterTelefone}
            onChange={setFilterTelefone}
            placeholder="Filtre por telefone"
            label="Telefone"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            options={opcoes}
            placeholder="Selecione o status"
            label="Status"
          />
        </div>
      </div>

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

        {isModalOpen && clienteSelecionado && (
          <VisualizarCliente
            cliente={clienteSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setClienteSelecionado(null);
            }}
          />
        )}

        {isEditModalOpen && clienteParaEditar && (
          <EditarCliente
            cliente={clienteParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setClienteParaEditar(null);
              carregarClientes(); // Atualiza a lista após editar
            }}
          />
        )}

        {isDeleteModalOpen && clienteParaExcluir && (
          <DeletarCliente
            clienteId={clienteParaExcluir.id.toString()}
            onClose={fecharModalExcluir}
            onDelete={() => {
              carregarClientes();
              fecharModalExcluir();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default TabelaClientes;
