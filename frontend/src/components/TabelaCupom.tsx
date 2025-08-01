import styles from "../styles/tabelas.module.css";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Filtros } from "./Filtros";
import { FiltroDropdown } from "./FiltrosDropdown";
import type { Opcao } from "./FiltrosDropdown";
import CancelarCupom from "./CancelarCupom";
import VisualizarCupom from "./VisualizarCupom";
import EditarCupom from "./EditarCupom";

type Cupom = {
  id: number;
  nome: string;
  tipo: string;
  valorDesconto: number;
  valorMaximoDesconto: number;
  valorMinimoCompra: number;
  categoria: string;
  dataInicio: string;
  dataTermino: string;
  descricao: string;
  status: string;
  usos_permitidos: number;
  usos_realizados: number;
};

export default function TabelaCupom() {
  const data: Cupom[] = [
    {
      id: 1,
      nome: "Promoção Dia das Mães",
      tipo: "percentual",
      valorDesconto: 15,
      valorMaximoDesconto: 50,
      valorMinimoCompra: 100,
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
      valorMaximoDesconto: 20,
      valorMinimoCompra: 50,
      categoria: "Orquídeas",
      dataInicio: "2025-08-01",
      dataTermino: "2025-08-15",
      descricao: "R$ 20 de desconto em compras de orquídeas.",
      status: "ativo",
      usos_permitidos: 50,
      usos_realizados: 12,
    },
    {
      id: 3,
      nome: "Cupom Primavera",
      tipo: "percentual",
      valorDesconto: 10,
      valorMaximoDesconto: 30,
      valorMinimoCompra: 80,
      categoria: "Buquês",
      dataInicio: "2025-09-01",
      dataTermino: "2025-09-30",
      descricao: "Cupom de 10% de desconto para celebrar a primavera.",
      status: "inativo",
      usos_permitidos: 80,
      usos_realizados: 80,
    },
    {
      id: 4,
      nome: "Especial Aniversário da Loja",
      tipo: "percentual",
      valorDesconto: 20,
      valorMaximoDesconto: 60,
      valorMinimoCompra: 120,
      categoria: "Todos",
      dataInicio: "2025-10-01",
      dataTermino: "2025-10-07",
      descricao: "20% de desconto em toda a loja na semana de aniversário.",
      status: "ativo",
      usos_permitidos: 120,
      usos_realizados: 95,
    },
    {
      id: 5,
      nome: "Cupom Natal",
      tipo: "valor",
      valorDesconto: 25,
      valorMaximoDesconto: 25,
      valorMinimoCompra: 90,
      categoria: "Arranjos Natalinos",
      dataInicio: "2025-12-01",
      dataTermino: "2025-12-25",
      descricao: "R$ 25 de desconto em arranjos natalinos.",
      status: "ativo",
      usos_permitidos: 200,
      usos_realizados: 110,
    },
    {
      id: 6,
      nome: "Promoção Volta às Aulas",
      tipo: "percentual",
      valorDesconto: 12,
      valorMaximoDesconto: 40,
      valorMinimoCompra: 70,
      categoria: "Suculentas",
      dataInicio: "2025-02-01",
      dataTermino: "2025-02-15",
      descricao:
        "12% de desconto em suculentas para presentear professores e alunos.",
      status: "inativo",
      usos_permitidos: 60,
      usos_realizados: 20,
    },
  ];

  const [filterID, setFilterID] = useState("");
  const [filterNome, setFilterNome] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredData = data.filter((item) => {
    return (
      (filterID === "" || item.id.toString().includes(filterID)) &&
      (filterNome === "" ||
        item.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
      (filterTipo === "" || item.tipo === filterTipo) &&
      (filterCategoria === "" || item.categoria === filterCategoria) &&
      (filterStatus === "" || item.status === filterStatus)
    );
  });

  const opcoesCategoria: Opcao[] = [
    { label: "Flores", value: "flores" },
    { label: "Arranjos", value: "arranjos" },
    { label: "Vasos", value: "vasos" },
  ];

  const opcoes: Opcao[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const opcoesTipo: Opcao[] = [
    { label: "Porcentagem", value: "porcentagem" },
    { label: "Fixo", value: "Fixo" },
  ];

  const statusTemplate = (rowData: any) => {
    const status = rowData.status?.toLowerCase() || "indefinido";
    return (
      <span className={`${styles["status-badge"]} ${styles[status]}`}>
        {rowData.status || "Indefinido"}
      </span>
    );
  };

  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [cupomParaVisualizar, setCupomParaVisualizar] = useState<Cupom | null>(
    null
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cupomParaEditar, setCupomParaEditar] = useState<Cupom | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cupomParaExcluir, setCupomParaExcluir] = useState<Cupom | null>(null);

  const actionTemplate = (rowData: any) => {
    return (
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
  };

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
            options={opcoes}
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
              // Ação para cancelar desconto, aqui só fecha o modal
              console.log("Cancelar cupom:", cupomParaExcluir.id);
              setIsDeleteModalOpen(false);
              // Aqui você pode adicionar a lógica para remover da lista, se quiser
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
