import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/tabelas.module.css";
import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";
import VisualizarCupom from "./visualizarCupom";
import EditarCupom from "./editarCupom";

export default function TabelaCupons() {
  const [cupons, setCupons] = useState([]);
  const [filtros, setFiltros] = useState({
    id: "",
    codigo: "",
    tipo: "",
    validade: "",
    estado: "",
    produto: "",
  });

  const opcoesEstado = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [cupomSelecionado, setCupomSelecionado] = useState(null);

  const [modalEditar, setModalEditar] = useState(false);
  const [cupomParaEditar, setCupomParaEditar] = useState(null);

  // Função para carregar cupons
  const carregarCupons = async () => {
    try {
      const response = await fetch("http://localhost:5000/listar_cupons", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Erro ao carregar cupons.");

      const resultado = await response.json();

      // Filtra apenas cupons com usos_permitidos não nulo
      const cuponsFiltrados = resultado.filter((c) => c.usos_permitidos > 0);

      // Formata os dados recebidos
      const cuponsFormatados = cuponsFiltrados.map((c) => ({
        id: c.id,
        codigo: c.codigo,
        tipo: c.tipo,
        descontoFixo: c.descontofixo,
        descontoPorcentagem: c.descontoPorcentagem,
        descontoFrete: c.descontofrete,
        validade: formatarData(c.validade),
        usosPermitidos: c.usos_permitidos,
        usosRealizados: c.usos_realizados,
        valorMinimo: c.valor_minimo,
        estado: c.estado === "ativo" ? "ativo" : "inativo",
        produto: c.produto,
      }));

      setCupons(cuponsFormatados);
    } catch (error) {
      console.error("Erro ao carregar cupons:", error);
    }
  };

  // Função para formatar a data no formato dd/mm/yyyy
  const formatarData = (dataISO) => {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Função para formatar o valor do desconto
  const formatarValorDesconto = (rowData) => {
    if (rowData.tipo === "valor_fixo") {
      return `R$${rowData.descontoFixo}`;
    } else if (rowData.tipo === "percentual") {
      return `${rowData.descontoPorcentagem}%`;
    }
    return "-";
  };

  useEffect(() => {
    carregarCupons();
  }, []);

  // Filtragem
  const filteredData = cupons.filter(
    (item) =>
      (!filtros.id || item.id.toString().startsWith(filtros.id)) &&
      (!filtros.codigo ||
        item.codigo.toLowerCase().startsWith(filtros.codigo.toLowerCase())) &&
      (!filtros.tipo ||
        item.tipo.toLowerCase().startsWith(filtros.tipo.toLowerCase())) &&
      (!filtros.validade || item.validade.startsWith(filtros.validade)) &&
      (!filtros.estado || item.estado === filtros.estado) &&
      (!filtros.produto ||
        item.produto.toLowerCase().startsWith(filtros.produto.toLowerCase()))
  );

  // Status template
  const estadoTemplate = (rowData) => (
    <span
      className={`${styles["status-badge"]} ${
        styles[rowData.estado?.toLowerCase() || "indefinido"]
      }`}
    >
      {rowData.estado || "Indefinido"}
    </span>
  );

  // Ações
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setCupomSelecionado(rowData);
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
          setCupomParaEditar(rowData);
          setModalEditar(true);
        }}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>

      <button
        className={styles.acaoBotao}
        onClick={async (e) => {
          e.stopPropagation();
          if (!confirm(`Deseja realmente deletar o cupom "${rowData.codigo}"?`))
            return;

          try {
            const response = await fetch(
              `http://127.0.0.1:5000/deletar_cupom/${rowData.id}`,
              { method: "DELETE" }
            );

            if (!response.ok) throw new Error("Erro ao deletar cupom.");

            const result = await response.json();
            alert(result.message || "Cupom deletado com sucesso!");
            // Atualiza a lista de cupons
            setCupons((prev) => prev.filter((c) => c.id !== rowData.id));
          } catch (error) {
            console.error("Erro ao deletar cupom:", error);
            alert("Erro ao deletar cupom.");
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
            value={filtros.codigo}
            onChange={(v) => setFiltros({ ...filtros, codigo: v })}
            placeholder="Filtre por Código"
            label="Código"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.tipo}
            onChange={(v) => setFiltros({ ...filtros, tipo: v })}
            placeholder="Filtre por Tipo"
            label="Tipo"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.validade}
            onChange={(v) => setFiltros({ ...filtros, validade: v })}
            placeholder="Filtre por Validade"
            label="Validade"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.produto}
            onChange={(v) => setFiltros({ ...filtros, produto: v })}
            placeholder="Filtre por Produto"
            label="Produto"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filtros.estado}
            onChange={(v) => setFiltros({ ...filtros, estado: v })}
            options={opcoesEstado}
            placeholder="Selecione o Estado"
            label="Estado"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="codigo" header="Código" />
          <Column field="tipo" header="Tipo" />
          <Column field="produto" header="Produto" />
          <Column
            header="Valor do Desconto"
            body={formatarValorDesconto} // Exibe o valor formatado
          />
          <Column field="validade" header="Validade" />
          <Column field="usosPermitidos" header="Usos Permitidos" />
          <Column field="valorMinimo" header="Valor Mínimo" />
          <Column field="estado" header="Estado" body={estadoTemplate} />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {/* Modais */}
        {modalVisualizar && cupomSelecionado && (
          <VisualizarCupom
            cupom={cupomSelecionado}
            onClose={() => {
              setModalVisualizar(false);
              setCupomSelecionado(null);
            }}
          />
        )}

        {modalEditar && cupomParaEditar && (
          <EditarCupom
            cupomInicial={cupomParaEditar}
            onClose={() => setModalEditar(false)}
            onConfirm={() => {
              carregarCupons();
            }}
          />
        )}
      </div>
    </div>
  );
}
