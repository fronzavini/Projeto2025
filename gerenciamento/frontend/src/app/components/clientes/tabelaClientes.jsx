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
import { deletarItem } from "../deletar";

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
      console.log(resultado);

      const raw = resultado.detalhes ?? resultado;

      const clientesFormatados = (Array.isArray(raw) ? raw : []).map((c) => {
        // Caso o backend retorne objeto com chaves
        if (!Array.isArray(c) && typeof c === "object") {
          const documento = c.cpf || c.cnpj || "";
          return {
            id: c.id ?? c.ID ?? c[0] ?? null,
            dataCadastro: c.dataCadastro ?? c.data_cadastro ?? c[1] ?? null,
            nome: c.nome ?? c.razao_social ?? c[2] ?? "",
            tipoPessoa: c.tipo ?? c.tipoPessoa ?? c[3] ?? "",
            genero: c.sexo ?? c.genero ?? c[4] ?? "",
            cpf: c.cpf ?? null,
            cnpj: c.cnpj ?? null,
            documento: documento,
            rg: c.rg ?? null,
            email: c.email ?? null,
            telefone: c.telefone ?? c.telefone1 ?? c[10] ?? "",
            dataNascimento: c.data_nascimento ?? c.dataNascimento ?? c[11] ?? "",
            status: (c.estado ?? c.status ?? 1) === 1 ? "ativo" : "inativo",
            cep: c.cep ?? c.endCep ?? c[13] ?? "",
            logradouro: c.logradouro ?? c.endRua ?? c[14] ?? "",
            numero: c.numero ?? c.endNumero ?? c[15] ?? "",
            bairro: c.bairro ?? c.endBairro ?? c[16] ?? "",
            complemento: c.complemento ?? c.endComplemento ?? c[17] ?? "",
            uf: c.uf ?? c.endUF ?? c[18] ?? "",
            cidade: c.cidade ?? c.endMunicipio ?? c[19] ?? "",
          };
        }

        // Caso o backend retorne array: mapear por índices conhecidos (fallback para heurística)
        const arr = Array.isArray(c) ? c : [];

        // Se tiver o número mínimo de colunas esperado (conforme screenshot / schema)
        if (arr.length >= 13) {
          const id = arr[0] ?? null;
          const dataCadastro = arr[1] ?? null;
          const nome = arr[2] ?? `Cliente ${id ?? ""}`;
          const tipoPessoa = arr[3] ?? "";
          const genero = arr[4] ?? "";
          const cpf = arr[5] ?? null;
          const cnpj = arr[6] ?? null;
          const rg = arr[7] ?? null;
          const email = arr[8] ?? null;
          const telefone = arr[9] ?? "";
          const dataNascimento = arr[10] ?? "";
          const estadoRaw = arr[11];
          const status = (estadoRaw ?? 1) === 1 ? "ativo" : "inativo";
          const cep = arr[12] ?? "";
          const logradouro = arr[13] ?? "";
          const numero = arr[14] ?? "";
          const bairro = arr[15] ?? "";
          const complemento = arr[16] ?? "";
          const uf = arr[17] ?? "";
          const cidade = arr[18] ?? arr[19] ?? "";

          const documento = cpf || cnpj || "";

          return {
            id,
            dataCadastro,
            nome,
            tipoPessoa,
            genero,
            cpf: cpf || null,
            cnpj: cnpj || null,
            documento,
            rg,
            email,
            telefone,
            dataNascimento,
            status,
            cep,
            logradouro,
            numero,
            bairro,
            complemento,
            uf,
            cidade,
          };
        }

        // fallback heurístico (caso formato diferente)
        let id = arr[0] ?? null;
        let nome = "";
        let telefone = "";
        let cpf = "";
        let cnpj = "";
        let dataNascimento = "";
        let status = null;
        let cep = "";
        let logradouro = "";
        let numero = "";
        let bairro = "";
        let complemento = "";
        let uf = "";
        let cidade = "";

        for (let i = 1; i < arr.length; i++) {
          const v = arr[i];
          if (v == null) continue;
          const s = String(v).trim();
          const digits = s.replace(/\D/g, "");

          // detectar data primeiro
          if (!dataNascimento) {
            const parsed = Date.parse(s);
            if (!Number.isNaN(parsed)) {
              const yr = new Date(parsed).getFullYear();
              if (yr > 1900 && yr < 2100) {
                dataNascimento = new Date(parsed).toISOString().slice(0, 10);
                continue;
              }
            }
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
              dataNascimento = s;
              continue;
            }
          }

          // cpf (11) ou cnpj (14)
          if (!cpf && digits.length === 11) {
            cpf = s;
            continue;
          }
          if (!cnpj && digits.length === 14) {
            cnpj = s;
            continue;
          }

          // telefone: preferir 10 ou 11 dígitos (não confundir com CEP de 8 dígitos)
          if (!telefone && (digits.length === 10 || digits.length === 11)) {
            telefone = s;
            continue;
          }

          // status 0/1
          if (status === null && (v === 0 || v === 1)) {
            status = v;
            continue;
          }

          // cep (8 dígitos)
          if (!cep && digits.length === 8) {
            cep = s;
            continue;
          }

          // nome (string com letras)
          if (!nome && /[A-Za-zÀ-ÿ]/.test(s)) {
            nome = s;
            continue;
          }

          // fallback por posições
          if (!logradouro && i === 14) logradouro = s;
          if (!numero && i === 15) numero = s;
          if (!bairro && i === 16) bairro = s;
          if (!complemento && i === 17) complemento = s;
          if (!uf && i === 18) uf = s;
          if (!cidade && i === 19) cidade = s;
        }

        const documento = cpf || cnpj || "";

        return {
          id,
          dataCadastro: arr[1] ?? null,
          nome: nome || `Cliente ${id ?? ""}`,
          tipoPessoa: arr[3] ?? "",
          genero: arr[4] ?? "",
          cpf: cpf || null,
          cnpj: cnpj || null,
          documento,
          rg: arr[7] ?? null,
          email: arr[8] ?? null,
          telefone,
          dataNascimento,
          status: status === 1 ? "ativo" : "inativo",
          cep,
          logradouro,
          numero,
          bairro,
          complemento,
          uf,
          cidade,
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
      (!filtros.id || item.id.toString().startsWith(filtros.id)) &&
      (!filtros.cpf || item.cpf.startsWith(filtros.cpf)) &&
      (!filtros.nome ||
        item.nome.toLowerCase().startsWith(filtros.nome.toLowerCase())) &&
      (!filtros.telefone || item.telefone.startsWith(filtros.telefone)) &&
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
          if (!confirm(`Deseja realmente deletar o cliente "${rowData.nome}"?`)) return;

          try {
            const response = await fetch(
              `http://127.0.0.1:5000/deletar_cliente/${rowData.id}`,
              { method: "DELETE" }
            );

            if (!response.ok) throw new Error("Erro ao deletar cliente.");

            const result = await response.json();
            alert(result.message || "Produto deletado com sucesso!");
            // Atualiza a lista de produtos
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
    </div>
  );
}