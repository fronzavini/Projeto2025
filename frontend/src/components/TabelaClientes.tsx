import styles from "../styles/tabelas.module.css";
import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";
import type { Opcao } from "./FiltrosDropdown";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function TabelaClientes() {
  const data = [
    {
      id: 1,
      cpf: "111.222.333-44",
      nome: "João da Silva",
      telefone: "(47) 99988-7766",
      status: "ativo",
    },
    {
      id: 2,
      cpf: "222.333.444-55",
      nome: "Maria Oliveira",
      telefone: "(47) 98877-6655",
      status: "inativo",
    },
    {
      id: 3,
      cpf: "333.444.555-66",
      nome: "Carlos Pereira",
      telefone: "(47) 97766-5544",
      status: "ativo",
    },
    {
      id: 4,
      cpf: "444.555.666-77",
      nome: "Ana Souza",
      telefone: "(47) 96655-4433",
      status: "ativo",
    },
    {
      id: 5,
      cpf: "555.666.777-88",
      nome: "Lucas Fernandes",
      telefone: "(47) 95544-3322",
      status: "inativo",
    },
    {
      id: 6,
      cpf: "666.777.888-99",
      nome: "Beatriz Lima",
      telefone: "(47) 94433-2211",
      status: "ativo",
    },
    {
      id: 7,
      cpf: "777.888.999-00",
      nome: "Rafael Costa",
      telefone: "(47) 93322-1100",
      status: "ativo",
    },
    {
      id: 8,
      cpf: "888.999.000-11",
      nome: "Juliana Martins",
      telefone: "(47) 92211-0099",
      status: "inativo",
    },
    {
      id: 9,
      cpf: "999.000.111-22",
      nome: "Fernando Alves",
      telefone: "(47) 91100-9988",
      status: "ativo",
    },
    {
      id: 10,
      cpf: "000.111.222-33",
      nome: "Camila Rocha",
      telefone: "(47) 90099-8877",
      status: "ativo",
    },
    {
      id: 11,
      cpf: "123.456.789-00",
      nome: "Marcelo Duarte",
      telefone: "(47) 98988-7766",
      status: "ativo",
    },
    {
      id: 12,
      cpf: "234.567.890-11",
      nome: "Aline Ribeiro",
      telefone: "(47) 97877-6655",
      status: "inativo",
    },
    {
      id: 13,
      cpf: "345.678.901-22",
      nome: "Gustavo Teixeira",
      telefone: "(47) 96766-5544",
      status: "ativo",
    },
    {
      id: 14,
      cpf: "456.789.012-33",
      nome: "Patrícia Andrade",
      telefone: "(47) 95655-4433",
      status: "ativo",
    },
    {
      id: 15,
      cpf: "567.890.123-44",
      nome: "Henrique Barros",
      telefone: "(47) 94544-3322",
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

  const actionTemplate = (rowData: any) => {
    return (
      <div className={styles.acoes}>
        <button
          className={styles.acaoBotao}
          onClick={() => console.log("Visualizar", rowData)}
          title="Visualizar"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button
          className={styles.acaoBotao}
          onClick={() => console.log("Editar", rowData)}
          title="Editar"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          className={styles.acaoBotao}
          onClick={() => console.log("Deletar", rowData)}
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
      </div>
    </div>
  );
}

export default TabelaClientes;
