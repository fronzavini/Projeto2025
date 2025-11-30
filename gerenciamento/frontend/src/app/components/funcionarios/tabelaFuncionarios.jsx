"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/tabelas.module.css";

import { Filtros } from "../filtros";
import VisualizarFuncionario from "./visualizarFuncionario";
import EditarFuncionario from "./editarFuncionario";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TabelaFuncionario() {
  const [funcionarios, setFuncionarios] = useState([]);

  // Filtros
  const [filterId, setFilterId] = useState("");
  const [filterCpf, setFilterCpf] = useState("");
  const [filterNome, setFilterNome] = useState("");
  const [filterFuncao, setFilterFuncao] = useState("");

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [funcionarioParaEditar, setFuncionarioParaEditar] = useState(null);

  // Carregar funcionários do backend
  const carregarFuncionarios = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/listar_funcionarios",
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Erro ao carregar funcionários");

      const resultado = await response.json();

      // Formata o resultado usando os índices corretos
      const funcionariosFormatados = Array.isArray(resultado)
        ? resultado.map((f) => ({
            id: f[0],
            nome: f[1],
            cpf: f[2],
            rg: f[3],
            data_nascimento: f[4],
            sexo: f[5],
            email: f[6],
            estado: f[7], // confirmar se é esse mesmo
            telefone: f[8],
            cep: f[9],
            logradouro: f[10],
            numero: f[11],
            bairro: f[12],
            complemento: f[13],
            uf: f[14],
            cidade: f[15],
            funcao: f[16],
            salario: f[17],
            data_contratacao: f[18],
          }))
        : [];

      setFuncionarios(funcionariosFormatados);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      setFuncionarios([]);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  // Filtragem
  const filteredData = funcionarios.filter((item) => {
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterCpf || item.cpf.startsWith(filterCpf)) &&
      (!filterNome ||
        item.nome.toLowerCase().startsWith(filterNome.toLowerCase())) &&
      (!filterFuncao ||
        item.funcao.toLowerCase().startsWith(filterFuncao.toLowerCase()))
    );
  });

  // Template das ações
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setFuncionarioSelecionado(rowData);
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
          setFuncionarioParaEditar(rowData);
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
          if (
            !confirm(
              `Deseja realmente deletar o funcionário "${rowData.nome}"?`
            )
          )
            return;

          try {
            const response = await fetch(
              `http://127.0.0.1:5000/deletar_funcionario/${rowData.id}`,
              { method: "DELETE" }
            );

            if (!response.ok) throw new Error("Erro ao deletar funcionário");

            const result = await response.json();
            alert(result.message || "Funcionário deletado com sucesso!");
            setFuncionarios((prev) => prev.filter((f) => f.id !== rowData.id));
          } catch (error) {
            console.error("Erro ao deletar funcionário:", error);
            alert("Erro ao deletar funcionário.");
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
      {/* Filtros */}
      <div className={styles["filters-container"]}>
        <Filtros
          value={filterId}
          onChange={setFilterId}
          placeholder="Filtre por ID"
          label="ID"
        />
        <Filtros
          value={filterCpf}
          onChange={setFilterCpf}
          placeholder="Filtre por CPF"
          label="CPF"
        />
        <Filtros
          value={filterNome}
          onChange={setFilterNome}
          placeholder="Filtre por nome"
          label="Nome"
        />
        <Filtros
          value={filterFuncao}
          onChange={setFilterFuncao}
          placeholder="Filtre por função"
          label="Função"
        />
      </div>

      {/* Tabela */}
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="cpf" header="CPF" />
          <Column field="nome" header="Nome" />
          <Column field="email" header="Email" />
          <Column field="funcao" header="Função" />
          <Column body={actionTemplate} header="Ações" style={{ width: 150 }} />
        </DataTable>

        {/* Modais */}
        {isModalOpen && funcionarioSelecionado && (
          <VisualizarFuncionario
            funcionario={funcionarioSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setFuncionarioSelecionado(null);
              carregarFuncionarios();
            }}
          />
        )}

        {isEditModalOpen && funcionarioParaEditar && (
          <EditarFuncionario
            funcionario={funcionarioParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setFuncionarioParaEditar(null);
              carregarFuncionarios();
            }}
          />
        )}
      </div>
    </div>
  );
}
