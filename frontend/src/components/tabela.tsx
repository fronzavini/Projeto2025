import styles from "../styles/tabelas.module.css";
import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";
import type { Opcao } from "./FiltrosDropdown";

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function Tabela() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filterId, setFilterId] = useState<string>("");
  const [filterCpf, setFilterCpf] = useState<string>("");
  const [filterNome, setFilterNome] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterTelefone, setFilterTelefone] = useState<string>("");

  const opcoes: Opcao[] = [
    { label: "Ativo", value: "true" },
    { label: "Inativo", value: "false" },
  ];

  // carregar dados do backend
  useEffect(() => {
    fetch("http://localhost:5000/listar_clientes")
      .then((res) => res.json())
      .then((resposta) => {
        if (resposta.resultado === "ok") {
          setData(resposta.detalhes);
        } else {
          setError(resposta.detalhes);
        }
      })
      .catch((e) => setError("Erro ao conectar com o backend"))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = data.filter((item) => {
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterCpf || (item.cpf || "").startsWith(filterCpf)) &&
      (!filterNome ||
        item.nome.toLowerCase().startsWith(filterNome.toLowerCase())) &&
      (!filterTelefone || (item.telefone || "").startsWith(filterTelefone)) &&
      (!filterStatus ||
        item.estado?.toString() === filterStatus)
    );
  });

  const statusTemplate = (rowData: any) => {
    const status = rowData.estado ? "ativo" : "inativo";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

      {error && <p className="text-red-500 ml-4">{error}</p>}

      <div className={styles["custom-table-container"]}>
        <DataTable
          value={filteredData}
          paginator
          rows={5}
          showGridlines
          loading={loading}
        >
          <Column field="id" header="ID" />
          <Column field="cpf" header="CPF" />
          <Column field="nome" header="Nome" />
          <Column field="telefone" header="Telefone" />
          <Column field="estado" header="Status" body={statusTemplate} />
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

export default Tabela;
