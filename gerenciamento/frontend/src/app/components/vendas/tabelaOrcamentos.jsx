"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/tabelas.module.css";
import VisualizarPedido from "./visualizarPedido";
import CadastrarOrcamento from "./cadastrarOrcamento";
import EditarOrcamento from "./editarOrcamento";

const API = "http://192.168.18.155:5000";

export default function TabelaOrcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalNovo, setModalNovo] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);

  async function carregarOrcamentos() {
    setLoading(true);
    try {
      let res = await fetch(`${API}/listar_orcamentos`);
      if (res.ok) {
        const body = await res.json();
        setOrcamentos(body);
        return;
      }
      res = await fetch(`${API}/listar_vendas`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const vendas = await res.json();
      const apenasOrcamentos = vendas.filter(
        (v) => v.tipo === "orcamento" || v.tipo === "orcamento".toLowerCase()
      );
      setOrcamentos(apenasOrcamentos);
    } catch (e) {
      console.error("Erro ao carregar orçamentos:", e);
      setOrcamentos([]);
      alert("Erro ao carregar orçamentos. Verifique rotas no backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const actionTemplate = (row) => (
    <div className={styles.acoes}>
      <button
        className={styles.acaoBotao}
        onClick={() => setModalVisualizar(row)}
        title="Visualizar"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <button
        className={styles.acaoBotao}
        onClick={() => setModalEditar(row)}
        title="Editar"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button
        className={styles.acaoBotao}
        onClick={async () => {
          if (!confirm(`Deseja excluir o orçamento ${row.id ?? row.codigo ?? ""}?`))
            return;
          try {
            const res = await fetch(`${API}/deletar_venda/${row.id}`, {
              method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao deletar");
            alert("Orçamento removido");
            carregarOrcamentos();
          } catch (e) {
            console.error(e);
            alert("Erro ao excluir orçamento");
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


      <DataTable
        value={orcamentos}
        paginator
        rows={8}
        loading={loading}
        className={styles["custom-table-container"]}
      >
        <Column field="id" header="ID" />
        <Column
          field="cliente"
          header="Cliente"
          body={(r) => r.cliente_nome ?? r.cliente ?? r.clienteId ?? "-"}
        />
        <Column
          field="valorTotal"
          header="Total"
          body={(r) => `R$ ${Number(r.valorTotal ?? r.valor_total ?? r.valor).toFixed(2)}`}
        />
        <Column field="dataVenda" header="Data" />
        <Column
          header="Ações"
          body={actionTemplate}
          style={{ width: "150px" }}
        />
      </DataTable>

      {modalNovo && (
        <CadastrarOrcamento
          onClose={() => {
            setModalNovo(false);
            carregarOrcamentos();
          }}
          onConfirm={() => carregarOrcamentos()}
        />
      )}

      {modalVisualizar && (
        <VisualizarPedido
          pedido={modalVisualizar}
          onClose={() => {
            setModalVisualizar(null);
            carregarOrcamentos();
          }}
        />
      )}

      {modalEditar && (
        <EditarOrcamento
          registro={modalEditar}
          onClose={() => {
            setModalEditar(null);
            carregarOrcamentos();
          }}
        />
      )}
    </div>
  );
}