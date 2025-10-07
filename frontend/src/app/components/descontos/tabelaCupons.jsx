"use client";
import styles from "../../styles/tabelas.module.css";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";

import { deletarItem } from "../deletar";
import VisualizarCupom from "./visualizarCupom";
import EditarCupom from "./editarCupom";

export default function TabelaCupom() {
  const [dados, setDados] = useState([]);

  // Filtros
  const [filterID, setFilterID] = useState("");
  const [filterCodigo, setFilterCodigo] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Carregar cupons do backend
  const carregarCupons = async () => {
    try {
      const response = await fetch("http://localhost:5000/listar_cupons");
      if (!response.ok) throw new Error("Erro ao carregar cupons.");
      const resultado = await response.json();
      setDados(resultado);
    } catch (error) {
      alert("Erro ao carregar cupons.");
    }
  };

  useEffect(() => {
    carregarCupons();
  }, []);

  // Filtros aplicados
  const filteredData = dados.filter(
    (item) =>
      (!filterID || item.id?.toString().includes(filterID)) &&
      (!filterCodigo ||
        (item.codigo || "")
          .toLowerCase()
          .includes(filterCodigo.toLowerCase())) &&
      (!filterTipo || item.tipo === filterTipo) &&
      (!filterStatus || item.estado === filterStatus)
  );

  // Opções para dropdowns
  const opcoesTipo = [
    { label: "Porcentagem", value: "percentual" },
    { label: "Fixo", value: "fixo" },
    { label: "Frete", value: "frete" },
  ];

  const opcoesStatus = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
    { label: "Expirado", value: "expirado" },
  ];

  // Estados para modais
  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [cupomParaVisualizar, setCupomParaVisualizar] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cupomParaEditar, setCupomParaEditar] = useState(null);

  // Função para deletar cupom
  const handleDeleteCupom = async (cupom) => {
    await deletarItem({
      itemId: cupom.id,
      itemTipo: "cupom",
      onDelete: async () => {
        try {
          const resp = await fetch(
            `http://localhost:5000/deletar_cupom/${cupom.id}`,
            { method: "DELETE" }
          );
          if (!resp.ok) throw new Error();
          setDados((prev) => prev.filter((c) => c.id !== cupom.id));
        } catch {
          alert("Erro ao deletar cupom.");
        }
      },
    });
  };

  // Template das ações do DataTable
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
          handleDeleteCupom(rowData);
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
            value={filterID}
            onChange={setFilterID}
            placeholder="ID"
            label="ID"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filterCodigo}
            onChange={setFilterCodigo}
            placeholder="Código"
            label="Código"
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
            value={filterStatus}
            onChange={setFilterStatus}
            options={opcoesStatus}
            placeholder="Todos"
            label="Status"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="codigo" header="Código" />
          <Column field="tipo" header="Tipo" />
          <Column field="descontofixo" header="Desconto Fixo" />
          <Column field="descontoPorcentagem" header="Desconto %" />
          <Column field="descontofrete" header="Desconto Frete" />
          <Column field="validade" header="Validade" />
          <Column field="usos_permitidos" header="Usos Permitidos" />
          <Column field="usos_realizados" header="Usos Realizados" />
          <Column field="valor_minimo" header="Valor Mínimo" />
          <Column field="estado" header="Estado" />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {/* Modal Visualizar */}
        {isVisualizarModalOpen && cupomParaVisualizar && (
          <VisualizarCupom
            cupom={cupomParaVisualizar}
            onClose={() => {
              setIsVisualizarModalOpen(false);
              setCupomParaVisualizar(null);
            }}
          />
        )}

        {/* Modal Editar */}
        {isEditModalOpen && cupomParaEditar && (
          <EditarCupom
            cupom={cupomParaEditar}
            onClose={() => {
              setIsEditModalOpen(false);
              setCupomParaEditar(null);
              carregarCupons(); // Atualiza após edição
            }}
          />
        )}
      </div>
    </div>
  );
}