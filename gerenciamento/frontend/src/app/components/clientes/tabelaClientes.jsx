"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/tabelas.module.css";
import { Filtros } from "../filtros";
import { FiltroDropdown } from "../filtrosDropdown";

import VisualizarCliente from "./visualizarCliente";
import EditarCliente from "./editarCliente";

export default function TabelaClientes() {
  const [clientes, setClientes] = useState([]);

  const [filtros, setFiltros] = useState({
    id: "",
    cpf: "",
    nome: "",
    telefone: "",
    status: "",
  });

  const opcoesStatus = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [modalEditar, setModalEditar] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  // Travar/destravar scroll do body quando qualquer modal estiver aberto
  useEffect(() => {
    const aberto = modalVisualizar || modalEditar;
    const cls = "modal-open";
    if (aberto) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => document.body.classList.remove(cls);
  }, [modalVisualizar, modalEditar]);

  // Carregar clientes
  const carregarClientes = async () => {
    try {
      const response = await fetch("http://localhost:5000/listar_clientes", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Erro ao carregar clientes.");

      const resultado = await response.json();
      const raw = resultado.detalhes ?? resultado;

      const clientesFormatados = (Array.isArray(raw) ? raw : []).map((c) => {
        if (c && typeof c === "object" && !Array.isArray(c)) {
          const id = c.id ?? c.ID ?? null;
          const dataCadastro = c.dataCadastro ?? c.data_cadastro ?? null;
          const nome = c.nome ?? c.razao_social ?? "";
          const tipo = c.tipo ?? "fisico";
          const sexo = c.sexo ?? c.genero ?? "";
          const cpf = c.cpf ?? null;
          const cnpj = c.cnpj ?? null;
          const rg = c.rg ?? null;
          const email = c.email ?? null;
          const telefone = c.telefone ?? c.telefone1 ?? "";
          const dataNasc =
            c.dataNasc ?? c.data_nascimento ?? c.dataNascimento ?? "";
          const estadoRaw = c.estado ?? c.status ?? 1;
          const status =
            estadoRaw === 1 || estadoRaw === true ? "ativo" : "inativo";
          const endCep = c.endCep ?? c.end_cep ?? c.cep ?? "";
          const endRua = c.endRua ?? c.end_rua ?? c.logradouro ?? "";
          const endNumero = c.endNumero ?? c.end_numero ?? c.numero ?? "";
          const endBairro = c.endBairro ?? c.end_bairro ?? c.bairro ?? "";
          const endComplemento =
            c.endComplemento ?? c.end_complemento ?? c.complemento ?? "";
          const endUF = c.endUF ?? c.end_uf ?? c.uf ?? "";
          const endMunicipio =
            c.endMunicipio ?? c.end_municipio ?? c.cidade ?? "";
          const documento = cpf || cnpj || "";

          return {
            id,
            dataCadastro,
            nome,
            tipo,
            sexo,
            cpf,
            cnpj,
            rg,
            email,
            telefone,
            dataNasc,
            estado: estadoRaw === 1 || estadoRaw === true,
            status,
            endCep,
            endRua,
            endNumero,
            endBairro,
            endComplemento,
            endUF,
            endMunicipio,
            documento,
          };
        }

        if (Array.isArray(c)) {
          const arr = c;
          const id = arr[0] ?? null;
          const dataCadastro = arr[1] ?? null;
          const nome = arr[2] ?? "";
          const tipo = arr[3] ?? "fisico";
          const sexo = arr[4] ?? "";
          const cpf = arr[5] ?? null;
          const cnpj = arr[6] ?? null;
          const rg = arr[7] ?? null;
          const email = arr[8] ?? null;
          const telefone = arr[9] ?? "";
          const dataNasc = arr[10] ?? "";
          const estadoRaw = arr[11];
          const status =
            estadoRaw === 1 || estadoRaw === true ? "ativo" : "inativo";
          const endCep = arr[12] ?? "";
          const endRua = arr[13] ?? "";
          const endNumero = arr[14] ?? "";
          const endBairro = arr[15] ?? "";
          const endComplemento = arr[16] ?? "";
          const endUF = arr[17] ?? "";
          const endMunicipio = arr[18] ?? arr[19] ?? "";
          const documento = cpf || cnpj || "";

          return {
            id,
            dataCadastro,
            nome,
            tipo,
            sexo,
            cpf,
            cnpj,
            rg,
            email,
            telefone,
            dataNasc,
            estado: estadoRaw === 1 || estadoRaw === true,
            status,
            endCep,
            endRua,
            endNumero,
            endBairro,
            endComplemento,
            endUF,
            endMunicipio,
            documento,
          };
        }

        return {
          id: null,
          dataCadastro: null,
          nome: String(c) ?? "",
          tipo: "fisico",
          sexo: "",
          cpf: null,
          cnpj: null,
          rg: null,
          email: null,
          telefone: "",
          dataNasc: "",
          estado: true,
          status: "ativo",
          endCep: "",
          endRua: "",
          endNumero: "",
          endBairro: "",
          endComplemento: "",
          endUF: "",
          endMunicipio: "",
          documento: "",
        };
      });

      setClientes(clientesFormatados);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setClientes([]);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  // Filtragem
  const filteredData = clientes.filter(
    (item) =>
      (!filtros.id || String(item.id).startsWith(filtros.id)) &&
      (!filtros.cpf || (item.cpf && item.cpf.startsWith(filtros.cpf))) &&
      (!filtros.nome ||
        item.nome.toLowerCase().startsWith(filtros.nome.toLowerCase())) &&
      (!filtros.telefone ||
        (item.telefone && item.telefone.startsWith(filtros.telefone))) &&
      (!filtros.status || item.status === filtros.status)
  );

  // Status template
  const statusTemplate = (rowData) => (
    <span
      className={`${styles["status-badge"]} ${
        styles[rowData.status?.toLowerCase() || "indefinido"]
      }`}
    >
      {rowData.status || "Indefinido"}
    </span>
  );

  // Ações
  const actionTemplate = (rowData) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={(e) => {
          e.stopPropagation();
          setClienteSelecionado(rowData);
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
          setClienteParaEditar(rowData);
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
          if (!confirm(`Deseja realmente deletar o cliente "${rowData.nome}"?`))
            return;

          try {
            const response = await fetch(
              `http://127.0.0.1:5000/deletar_cliente/${rowData.id}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) throw new Error("Erro ao deletar cliente.");

            const result = await response.json();
            alert(result.message || "Cliente deletado com sucesso!");
            setClientes((prev) => prev.filter((c) => c.id !== rowData.id));
          } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            alert("Erro ao deletar cliente.");
          }
        }}
        title="Excluir"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <>
      {/* Estilo global mínimo para bloquear o scroll do body quando modal abre */}
      <style jsx global>{`
        body.modal-open {
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 100%;
        }
        /* opcional: evita scroll no container do fundo quando modal aberto */
        body.modal-open .${styles["custom-table-container"]} {
          overflow: hidden !important;
        }
      `}</style>

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
            value={filtros.cpf}
            onChange={(v) => setFiltros({ ...filtros, cpf: v })}
            placeholder="Filtre por CPF/CNPJ"
            label="Documento"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.nome}
            onChange={(v) => setFiltros({ ...filtros, nome: v })}
            placeholder="Filtre por nome"
            label="Nome"
          />
        </div>
        <div className={styles.filtro}>
          <Filtros
            value={filtros.telefone}
            onChange={(v) => setFiltros({ ...filtros, telefone: v })}
            placeholder="Filtre por telefone"
            label="Telefone"
          />
        </div>
        <div className={styles.filtro}>
          <FiltroDropdown
            value={filtros.status}
            onChange={(v) => setFiltros({ ...filtros, status: v })}
            options={opcoesStatus}
            placeholder="Selecione o status"
            label="Status"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className={styles["custom-table-container"]}>
        <DataTable value={filteredData} paginator rows={5} showGridlines>
          <Column field="id" header="ID" />
          <Column field="documento" header="CPF / CNPJ" />
          <Column field="nome" header="Nome" />
          <Column field="telefone" header="Telefone" />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column
            body={actionTemplate}
            header="Ações"
            style={{ width: "150px" }}
          />
        </DataTable>

        {/* Modais */}
        {modalVisualizar && clienteSelecionado && (
          <VisualizarCliente
            cliente={clienteSelecionado}
            onClose={() => {
              setModalVisualizar(false);
              setClienteSelecionado(null);
            }}
          />
        )}

        {modalEditar && clienteParaEditar && (
          <EditarCliente
            cliente={clienteParaEditar}
            onClose={() => {
              setModalEditar(false);
              setClienteParaEditar(null);
              carregarClientes();
            }}
          />
        )}
      </div>
    </>
  );
}
