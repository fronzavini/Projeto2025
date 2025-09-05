import styles from "../styles/tabelas.module.css";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";

import CancelarCupom from "./CancelarCupom";
import VisualizarCupom from "./VisualizarCupom";
import EditarCupom from "./EditarCupom";

export default function TabelaCupom() {
  const data = [
    {
      id: 1,
      nome: "Promoção Dia das Mães",
      tipo: "percentual",
      valorDesconto: 15,
      categoria: "Flores",
      dataInicio: "2025-05-01",
      dataTermino: "2025-05-12",
      descricao: "Desconto especial de 15% em flores para o Dia das Mães.",
      status: "ativo",
      usos_permitidos: 100,
      usos_realizados: 35,
    },
    {
      id: 2,
      nome: "Desconto Orquídeas",
      tipo: "valor",
      valorDesconto: 20,
      categoria: "Orquídeas",
      dataInicio: "2025-08-01",
      dataTermino: "2025-08-15",
      descricao: "R$ 20 de desconto em compras de orquídeas.",
      status: "ativo",
      usos_permitidos: 50,
      usos_realizados: 12,
    },
    // ... outros cupons
  ];

  const [filterID, setFilterID] = useState("");
  const [filterNome, setFilterNome] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredData = data.filter(
    (item) =>
      (!filterID || item.id.toString().includes(filterID)) &&
      (!filterNome ||
        item.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
      (!filterTipo || item.tipo === filterTipo) &&
      (!filterCategoria || item.categoria === filterCategoria) &&
      (!filterStatus || item.status === filterStatus)
  );

  const opcoesCategoria = [
    { label: "Flores", value: "Flores" },
    { label: "Arranjos", value: "Arranjos" },
    { label: "Vasos", value: "Vasos" },
  ];

  const opcoesStatus = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const opcoesTipo = [
    { label: "Porcentagem", value: "percentual" },
    { label: "Fixo", value: "valor" },
  ];

  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [cupomParaVisualizar, setCupomParaVisualizar] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cupomParaEditar, setCupomParaEditar] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cupomParaExcluir, setCupomParaExcluir] = useState(null);

  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setCupomParaVisualizar(rowData);
          setIsVisualizarModalOpen(true);
        }}
        title="Visualizar"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setCupomParaEditar(rowData);
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
          setCupomParaExcluir(rowData);
          setIsDeleteModalOpen(true);
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div>
      <div className={styles["filters-container"]}>
        <div className={styles.filtro}>
          <Filtros
            value={filterID}
            onChange={setFilterID}
            placeholder="ID"
            label="ID"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterNome}
            onChange={setFilterNome}
            placeholder="EX: Dia das Mães"
            label="Nome"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterTipo}
            onChange={setFilterTipo}
            options={opcoesTipo}
            placeholder="Todos"
            label="Tipo"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterCategoria}
            onChange={setFilterCategoria}
            options={opcoesCategoria}
            placeholder="Todos"
            label="Categoria"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            options={opcoesStatus}
            placeholder="Todos"
            label="Status"
          />
        </div>
      </div>

      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="nome" header="Nome" />
          <Column field="tipo" header="Tipo" />
          <Column field="valorDesconto" header="Valor do Desconto" />
          <Column field="categoria" header="Categoria" />
          <Column field="dataTermino" header="Data de término" />
          <Column field="descricao" header="Descrição" />
          <Column field="usos_permitidos" header="Usos Permitidos" />
          <Column field="usos_realizados" header="Usos Realizados" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {isDeleteModalOpen && cupomParaExcluir && (
          <CancelarCupom
            cupomId={cupomParaExcluir.id}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              console.log("Cancelar cupom:", cupomParaExcluir.id);
              setIsDeleteModalOpen(false);
            }}
          />
        )}

        {isVisualizarModalOpen && cupomParaVisualizar && (
          <VisualizarCupom
            cupom={cupomParaVisualizar}
            onClose={() => {
              setIsVisualizarModalOpen(false);
              setCupomParaVisualizar(null);
            }}
          />
        )}

        {isEditModalOpen && cupomParaEditar && (
          <EditarCupom
            cupom={cupomParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setCupomParaEditar(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
