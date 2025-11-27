import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const API = "http://127.0.0.1:5000";

export default function EditarOrcamento({ registro, onClose, onConfirm }) {
  const [form, setForm] = useState({
    cliente: "",
    dataVenda: "",
    observacoes: "",
    itens: [],
    pago: false,
  });
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!registro) return;
    setForm({
      cliente: registro.cliente ?? registro.clienteId ?? "",
      dataVenda: registro.dataVenda ?? registro.data_venda ?? "",
      observacoes: registro.observacoes ?? registro.obs ?? "",
      itens: (registro.produtos ?? registro.itens ?? []).map((p) =>
        p.produtoId ? { produtoId: p.produtoId, preco: p.preco ?? p.valor, quantidade: p.quantidade } : { produtoId: p[0], preco: p[3] ?? 0, quantidade: p[2] ?? 1 }
      ),
      pago: registro.pago ?? false,
    });
    carregarProdutos();
  }, [registro]);

  async function carregarProdutos() {
    try {
      const res = await fetch(`${API}/listar_produtos`);
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      const body = await res.json();
      const itens = Array.isArray(body)
        ? body.map((p) => (Array.isArray(p) ? { id: p[0], nome: p[1], preco: Number(p[4] ?? 0) } : { id: p.id ?? p[0], nome: p.nome ?? p[1], preco: Number(p.preco ?? 0) }))
        : [];
      setProdutos(itens);
    } catch (e) {
      console.error(e);
      setProdutos([]);
    }
  }

  function alterarItem(idx, key, value) {
    setForm((f) => {
      const itens = [...f.itens];
      itens[idx] = { ...itens[idx], [key]: value };
      if (key === "produtoId") {
        const prod = produtos.find((p) => String(p.id) === String(value));
        if (prod) {
          itens[idx].preco = Number(prod.preco) || 0;
        }
      }
      return { ...f, itens };
    });
  }

  function calcularTotal() {
    return form.itens.reduce((acc, it) => acc + Number(it.preco || 0) * Number(it.quantidade || 0), 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      cliente: form.cliente,
      funcionario: null,
      produtos: form.itens.map((it) => ({ produtoId: it.produtoId, quantidade: Number(it.quantidade), preco: Number(it.preco) })),
      valorTotal: calcularTotal(),
      dataVenda: form.dataVenda || new Date().toISOString().slice(0, 10),
      entrega: false,
      tipo: "orcamento",
      pago: !!form.pago,
      observacoes: form.observacoes,
    };

    try {
      // tenta rota de edição específica
      const res = await fetch(`${API}/editar_venda/${registro.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Erro ${res.status}`);
      }

      alert("Orçamento atualizado com sucesso");
      if (onConfirm) onConfirm();
      onClose();
    } catch (e) {
      console.error("Erro ao atualizar orçamento:", e);
      alert("Erro ao atualizar orçamento. Verifique se a rota editar_venda existe no backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Editar Orçamento</h2>
            <button className={styles.botaoCancelar} type="button" onClick={onClose}>
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cliente</label>
              <input className={styles.input} value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Pago</label>
              <select className={styles.select} value={form.pago ? "true" : "false"} onChange={(e) => setForm({ ...form, pago: e.target.value === "true" })}>
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>

            <div>
              <h4>Itens</h4>
              {form.itens.map((it, idx) => (
                <div key={idx} className={styles.row} style={{ gap: 8, marginBottom: 8 }}>
                  <select value={it.produtoId} onChange={(e) => alterarItem(idx, "produtoId", e.target.value)} className={styles.select}>
                    <option value="">Selecione</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                  <input className={styles.input} type="number" value={it.preco} onChange={(e) => alterarItem(idx, "preco", e.target.value)} />
                  <input className={styles.input} type="number" value={it.quantidade} onChange={(e) => alterarItem(idx, "quantidade", e.target.value)} />
                </div>
              ))}
            </div>

            <div className={styles.formGroup}>
              <strong>Total: R$ {calcularTotal().toFixed(2)}</strong>
            </div>

            <button type="submit" className={styles.botaoEnviar} disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}