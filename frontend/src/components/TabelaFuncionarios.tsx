import styles from "../styles/tabelas.module.css";

import { Filtros } from "./Filtros";

import VisualizarFuncionario from "./VisualizarFuncionario";
import EditarFuncionario from "./EditarFuncionario";
import DeletarFuncionario from "./DeletarFuncionario";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TabelaFuncionario() {
  const data = [
    {
      id: 1,
      nome: "Carlos Silva",
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      data_nascimento: "1985-04-10",
      sexo: "masculino",
      email: "carlos.silva@email.com",
      senha: "func123",
      estado: true,
      telefone: "(47) 99999-1111",
      cep: "89000-100",
      logradouro: "Rua das Palmeiras",
      numero: "100",
      bairro: "Centro",
      complemento: "Sala 1",
      uf: "SC",
      funcao: "Vendedor",
    },
    {
      id: 2,
      nome: "Fernanda Souza",
      cpf: "987.654.321-00",
      rg: "98.765.432-1",
      data_nascimento: "1990-08-25",
      sexo: "feminino",
      email: "fernanda.souza@email.com",
      senha: "func123",
      estado: true,
      telefone: "(47) 98888-2222",
      cep: "89000-200",
      logradouro: "Rua das Rosas",
      numero: "200",
      bairro: "Itoupava Norte",
      complemento: "Apto 202",
      uf: "SC",
      funcao: "Gerente",
    },
    {
      id: 3,
      nome: "Marcos Lima",
      cpf: "321.654.987-00",
      rg: "45.678.910-2",
      data_nascimento: "1993-02-12",
      sexo: "masculino",
      email: "marcos.lima@email.com",
      senha: "func123",
      estado: false,
      telefone: "(47) 97777-3333",
      cep: "89000-300",
      logradouro: "Rua das Hortências",
      numero: "300",
      bairro: "Velha",
      complemento: "",
      uf: "SC",
      funcao: "Estoquista",
    },
    {
      id: 4,
      nome: "Aline Castro",
      cpf: "456.789.123-00",
      rg: "67.890.123-4",
      data_nascimento: "1995-06-20",
      sexo: "feminino",
      email: "aline.castro@email.com",
      senha: "func123",
      estado: true,
      telefone: "(47) 96666-4444",
      cep: "89000-400",
      logradouro: "Rua das Acácias",
      numero: "400",
      bairro: "Garcia",
      complemento: "Casa",
      uf: "SC",
      funcao: "Caixa",
    },
    {
      id: 5,
      nome: "Rafael Oliveira",
      cpf: "654.321.987-00",
      rg: "78.901.234-5",
      data_nascimento: "1988-11-05",
      sexo: "masculino",
      email: "rafael.oliveira@email.com",
      senha: "func123",
      estado: false,
      telefone: "(47) 95555-5555",
      cep: "89000-500",
      logradouro: "Rua das Violetas",
      numero: "500",
      bairro: "Fortaleza",
      complemento: "Bloco B",
      uf: "SC",
      funcao: "Entregador",
    },
  ];

  const [filterId, setFilterId] = useState<string>("");
  const [filterCpf, setFilterCpf] = useState<string>("");
  const [filterNome, setFilterNome] = useState<string>("");
  const [filterFuncao, setFilterFuncao] = useState<string>("");

  const filteredData = data.filter((item) => {
    return (
      (!filterId || item.id.toString().startsWith(filterId)) &&
      (!filterCpf || item.cpf.startsWith(filterCpf)) &&
      (!filterNome ||
        item.nome.toLowerCase().startsWith(filterNome.toLowerCase())) &&
      (!filterFuncao ||
        item.funcao.toLowerCase().startsWith(filterFuncao.toLowerCase()))
    );
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<
    any | null
  >(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [funcionarioParaEditar, setFuncionarioParaEditar] = useState<
    any | null
  >(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<
    any | null
  >(null);

  const actionTemplate = (rowData: any) => {
    return (
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
          onClick={(e) => {
            e.stopPropagation();
            setFuncionarioParaExcluir(rowData);
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
    setFuncionarioParaExcluir(null);
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
            value={filterFuncao}
            onChange={setFilterFuncao}
            placeholder="Filtre por função"
            label="Função"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="cpf" header="CPF" />
          <Column field="nome" header="Nome" />
          <Column field="email" header="Email" />
          <Column field="funcao" header="Funcao" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {isModalOpen && funcionarioSelecionado && (
          <VisualizarFuncionario
            funcionario={funcionarioSelecionado}
            onClose={() => {
              setIsModalOpen(false);
              setFuncionarioSelecionado(null);
            }}
          />
        )}

        {isEditModalOpen && funcionarioParaEditar && (
          <EditarFuncionario
            funcionario={funcionarioParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setFuncionarioParaEditar(null);
            }}
          />
        )}

        {isDeleteModalOpen && funcionarioParaExcluir && (
          <DeletarFuncionario
            funcionarioId={funcionarioParaExcluir.id.toString()}
            onClose={fecharModalExcluir}
            onDelete={fecharModalExcluir} // só fecha o modal, não deleta
          />
        )}
      </div>
    </div>
  );
}
