import styles from "../styles/tabelas.module.css";
import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";
import type { Opcao } from "./FiltrosDropdown";
import VisualizarCliente from "./VisualizarCliente";
import EditarCliente from "./EditarCliente";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function TabelaClientes() {
  const data = [
    {
      id: 1,
      nome: "João da Silva",
      tipo: "fisico",
      cpf: "111.222.333-44",
      rg: "12.345.678-9",
      email: "joao.silva@email.com",
      telefone: "(47) 99988-7766",
      dataNascimento: "1990-01-01",
      cep: "89000-001",
      numero: "101",
      cidade: "Indaial",
      bairro: "Centro",
      logradouro: "Rua das Flores",
      complemento: "Casa",
      status: "ativo",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      tipo: "fisico",
      cpf: "222.333.444-55",
      rg: "98.765.432-1",
      email: "maria.oliveira@email.com",
      telefone: "(47) 98877-6655",
      dataNascimento: "1985-05-15",
      cep: "89000-002",
      numero: "202",
      cidade: "Blumenau",
      bairro: "Velha",
      logradouro: "Rua das Acácias",
      complemento: "Apto 5",
      status: "inativo",
    },
    {
      id: 3,
      nome: "Carlos Pereira",
      tipo: "fisico",
      cpf: "333.444.555-66",
      rg: "23.456.789-0",
      email: "carlos.pereira@email.com",
      telefone: "(47) 97766-5544",
      dataNascimento: "1988-03-20",
      cep: "89000-003",
      numero: "303",
      cidade: "Gaspar",
      bairro: "Sete de Setembro",
      logradouro: "Rua dos Cedros",
      complemento: "",
      status: "ativo",
    },
    {
      id: 4,
      nome: "Ana Souza",
      tipo: "fisico",
      cpf: "444.555.666-77",
      rg: "34.567.890-1",
      email: "ana.souza@email.com",
      telefone: "(47) 96655-4433",
      dataNascimento: "1995-07-10",
      cep: "89000-004",
      numero: "404",
      cidade: "Indaial",
      bairro: "Carijós",
      logradouro: "Rua dos Jasmins",
      complemento: "Fundos",
      status: "ativo",
    },
    {
      id: 5,
      nome: "Lucas Fernandes",
      tipo: "fisico",
      cpf: "555.666.777-88",
      rg: "45.678.901-2",
      email: "lucas.fernandes@email.com",
      telefone: "(47) 95544-3322",
      dataNascimento: "1992-12-05",
      cep: "89000-005",
      numero: "505",
      cidade: "Timbó",
      bairro: "Araponguinhas",
      logradouro: "Rua das Hortências",
      complemento: "",
      status: "inativo",
    },
    {
      id: 6,
      nome: "Beatriz Lima",
      tipo: "fisico",
      cpf: "666.777.888-99",
      rg: "56.789.012-3",
      email: "beatriz.lima@email.com",
      telefone: "(47) 94433-2211",
      dataNascimento: "1991-09-18",
      cep: "89000-006",
      numero: "606",
      cidade: "Blumenau",
      bairro: "Itoupava Norte",
      logradouro: "Rua das Rosas",
      complemento: "Bloco B",
      status: "ativo",
    },
    {
      id: 7,
      nome: "Rafael Costa",
      tipo: "fisico",
      cpf: "777.888.999-00",
      rg: "67.890.123-4",
      email: "rafael.costa@email.com",
      telefone: "(47) 93322-1100",
      dataNascimento: "1993-11-30",
      cep: "89000-007",
      numero: "707",
      cidade: "Pomerode",
      bairro: "Centro",
      logradouro: "Rua das Palmeiras",
      complemento: "Sobrado",
      status: "ativo",
    },
    {
      id: 8,
      nome: "Juliana Martins",
      tipo: "fisico",
      cpf: "888.999.000-11",
      rg: "78.901.234-5",
      email: "juliana.martins@email.com",
      telefone: "(47) 92211-0099",
      dataNascimento: "1989-04-12",
      cep: "89000-008",
      numero: "808",
      cidade: "Indaial",
      bairro: "Estrada das Areias",
      logradouro: "Rua das Violetas",
      complemento: "",
      status: "inativo",
    },
    {
      id: 9,
      nome: "Fernando Alves",
      tipo: "fisico",
      cpf: "999.000.111-22",
      rg: "89.012.345-6",
      email: "fernando.alves@email.com",
      telefone: "(47) 91100-9988",
      dataNascimento: "1984-08-25",
      cep: "89000-009",
      numero: "909",
      cidade: "Timbó",
      bairro: "Quinta",
      logradouro: "Rua das Tulipas",
      complemento: "",
      status: "ativo",
    },
    {
      id: 10,
      nome: "Camila Rocha",
      tipo: "fisico",
      cpf: "000.111.222-33",
      rg: "90.123.456-7",
      email: "camila.rocha@email.com",
      telefone: "(47) 90099-8877",
      dataNascimento: "1996-06-22",
      cep: "89000-010",
      numero: "1001",
      cidade: "Blumenau",
      bairro: "Garcia",
      logradouro: "Rua das Magnólias",
      complemento: "Casa 2",
      status: "ativo",
    },
    {
      id: 11,
      nome: "Marcelo Duarte",
      tipo: "fisico",
      cpf: "123.456.789-00",
      rg: "11.223.344-5",
      email: "marcelo.duarte@email.com",
      telefone: "(47) 98988-7766",
      dataNascimento: "1987-10-11",
      cep: "89000-011",
      numero: "1111",
      cidade: "Indaial",
      bairro: "Centro",
      logradouro: "Rua das Bromélias",
      complemento: "",
      status: "ativo",
    },
    {
      id: 12,
      nome: "Aline Ribeiro",
      tipo: "fisico",
      cpf: "234.567.890-11",
      rg: "22.334.455-6",
      email: "aline.ribeiro@email.com",
      telefone: "(47) 97877-6655",
      dataNascimento: "1994-01-19",
      cep: "89000-012",
      numero: "1212",
      cidade: "Blumenau",
      bairro: "Fortaleza",
      logradouro: "Rua das Orquídeas",
      complemento: "",
      status: "inativo",
    },
    {
      id: 13,
      nome: "Gustavo Teixeira",
      tipo: "fisico",
      cpf: "345.678.901-22",
      rg: "33.445.566-7",
      email: "gustavo.teixeira@email.com",
      telefone: "(47) 96766-5544",
      dataNascimento: "1990-02-02",
      cep: "89000-013",
      numero: "1313",
      cidade: "Timbó",
      bairro: "Estados",
      logradouro: "Rua das Camélias",
      complemento: "",
      status: "ativo",
    },
    {
      id: 14,
      nome: "Patrícia Andrade",
      tipo: "fisico",
      cpf: "456.789.012-33",
      rg: "44.556.677-8",
      email: "patricia.andrade@email.com",
      telefone: "(47) 95655-4433",
      dataNascimento: "1992-03-03",
      cep: "89000-014",
      numero: "1414",
      cidade: "Indaial",
      bairro: "Warnow",
      logradouro: "Rua das Margaridas",
      complemento: "Casa de Esquina",
      status: "ativo",
    },
    {
      id: 15,
      nome: "Henrique Barros",
      tipo: "fisico",
      cpf: "567.890.123-44",
      rg: "55.667.788-9",
      email: "henrique.barros@email.com",
      telefone: "(47) 94544-3322",
      dataNascimento: "1986-09-09",
      cep: "89000-015",
      numero: "1515",
      cidade: "Blumenau",
      bairro: "Itoupava Central",
      logradouro: "Rua das Azaleias",
      complemento: "Fundos",
      status: "inativo",
    },
  ];

  const [filterId, setFilterId] = useState<string>("");
  const [filterCpf, setFilterCpf] = useState<string>("");
  const [filterNome, setFilterNome] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterTelefone, setFilterTelefone] = useState<string>("");

  const opcoes: Opcao[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const filteredData = data.filter((item) => {
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterCpf || item.cpf.startsWith(filterCpf)) &&
      (!filterNome ||
        item.nome.toLowerCase().startsWith(filterNome.toLowerCase())) &&
      (!filterTelefone || item.telefone.startsWith(filterTelefone)) &&
      (!filterStatus || filterStatus === "" || item.status === filterStatus)
    );
  });

  const statusTemplate = (rowData: any) => {
    const status = rowData.status.toLowerCase();
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status}
      </span>
    );
  };

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
            }}
          />
        )}
      </div>
    </div>
  );
}

export default TabelaClientes;
