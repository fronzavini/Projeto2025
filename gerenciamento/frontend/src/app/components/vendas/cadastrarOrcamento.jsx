"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

const API = "http://127.0.0.1:5000";

function formatCurrency(value) {
  const n = Number(value || 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CadastrarOrcamento({ onClose, onConfirm }) {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    clienteId: "",
    data: "",
    observacoes: "",
    itens: [],
    pago: false, // novo campo
  });

  useEffect(() => {
    carregarClientes();
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const res = await fetch(`${API}/listar_produtos`);
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      const body = await res.json();
      const itens = Array.isArray(body)
        ? body.map((p) =>
            Array.isArray(p)
              ? { id: p[0], nome: p[1], preco: Number(p[4] ?? 0) }
              : { id: p.id ?? p[0], nome: p.nome ?? p[1], preco: Number(p.preco ?? 0) }
          )
        : [];
      setProdutos(itens);
    } catch (e) {
      console.error("Erro ao carregar produtos:", e);
      setProdutos([]);
    }
  }

  async function carregarClientes() {
    try {
      const res = await fetch(`${API}/listar_clientes`);
      if (!res.ok) throw new Error("Erro ao carregar clientes");
      const body = await res.json();

      let clientesArray = [];
      if (Array.isArray(body)) {
        clientesArray = body.map((c) =>
          Array.isArray(c) ? { id: c[0], nome: c[1] } : { id: c.id ?? c[0], nome: c.nome ?? c[1] ?? "" }
        );
      } else if (body && typeof body === "object") {
        clientesArray = Object.values(body).map((c) =>
          Array.isArray(c) ? { id: c[0], nome: c[1] } : { id: c.id ?? c[0], nome: c.nome ?? c[1] ?? String(c) }
        );
      }

      setClientes(clientesArray);
    } catch (e) {
      console.error("Erro ao carregar clientes:", e);
      setClientes([]);
    }
  }

  function adicionarItem() {
    setForm((f) => ({
      ...f,
      itens: [...f.itens, { produtoId: "", nome: "", preco: 0, quantidade: 1 }],
    }));
  }

  function removerItem(index) {
    setForm((f) => {
      const itens = [...f.itens];
      itens.splice(index, 1);
      return { ...f, itens };
    });
  }

  function alterarItem(index, key, value) {
    setForm((f) => {
      const itens = [...f.itens];
      itens[index] = { ...itens[index], [key]: value };

      if (key === "produtoId") {
        const prod = produtos.find((p) => String(p.id) === String(value));
        if (prod) {
          itens[index].nome = prod.nome;
          itens[index].preco = Number(prod.preco) || 0;
        } else {
          itens[index].nome = "";
          itens[index].preco = 0;
        }
      }

      // garantir quantidade mínima 1
      if (key === "quantidade") {
        itens[index].quantidade = Math.max(1, Number(value) || 1);
      }

      return { ...f, itens };
    });
  }

  function calcularTotal() {
    return form.itens.reduce((acc, it) => acc + (Number(it.preco || 0) * Number(it.quantidade || 0)), 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.clienteId) {
      alert("Selecione um cliente.");
      return;
    }
    if (form.itens.length === 0) {
      alert("Adicione ao menos um item ao orçamento.");
      return;
    }
    setSubmitting(true);
    const payload = {
      cliente: form.clienteId,
      funcionario: null,
      produtos: form.itens.map((it) => ({
        produtoId: it.produtoId,
        quantidade: Number(it.quantidade),
        preco: Number(it.preco),
      })),
      valorTotal: calcularTotal(),
      dataVenda: form.data || new Date().toISOString().slice(0, 10),
      entrega: false,
      dataEntrega: null,
      tipo: "orcamento",
      pago: !!form.pago, // envia pago
      observacoes: form.observacoes,
    };

    try {
      const res = await fetch(`${API}/criar_venda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Erro ${res.status}`);
      }

      const result = await res.json();
      alert(result.message || "Orçamento criado com sucesso.");
      if (onConfirm) onConfirm();
      onClose();
      setForm({ clienteId: "", data: "", observacoes: "", itens: [] });
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
      alert(error.message || "Erro ao criar orçamento");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container} style={{ maxWidth: 920 }}>
          <div className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className={styles.headerTitle}>Novo Orçamento</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button className={styles.botaoCancelar} type="button" onClick={onClose} disabled={submitting}>
                Fechar
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 12 }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cliente</label>
                <select
                  className={styles.select}
                  value={form.clienteId}
                  onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                  required
                >
                  <option value="">Selecione cliente</option>
                  {(Array.isArray(clientes) ? clientes : []).map((c) => (
                    <option key={c.id ?? c[0]} value={c.id ?? c[0]}>
                      {c.nome ?? c[1] ?? String(c)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Data</label>
                <input type="date" className={styles.input} value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label className={styles.label} style={{ margin: 0 }}>Pago</label>
              <input type="checkbox" checked={!!form.pago} onChange={(e) => setForm({ ...form, pago: e.target.checked })} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Observações</label>
              <textarea className={styles.input} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={3} />
            </div>

            <div style={{ marginTop: 8 }}>
              <h4 style={{ margin: "8px 0" }}>Itens</h4>
              {form.itens.length === 0 && (
                <div style={{ marginBottom: 12, color: "#666" }}>Nenhum item. Adicione produtos ao orçamento.</div>
              )}

              {form.itens.map((it, idx) => (
                <div key={idx} className={styles.row} style={{ gap: 8, marginBottom: 8, alignItems: "center" }}>
                  {/* product selector with datalist */}
                  <div style={{ flex: 1 }}>
                    <input
                      list={`produtos-list-${idx}`}
                      className={styles.input}
                      placeholder="Pesquisar produto..."
                      value={it.nome}
                      onChange={(e) => {
                        const val = e.target.value;
                        // tentar resolver por nome parciais
                        const prod = produtos.find((p) => p.nome === val || String(p.id) === val);
                        if (prod) {
                          alterarItem(idx, "produtoId", prod.id);
                        } else {
                          alterarItem(idx, "nome", val);
                          alterarItem(idx, "produtoId", "");
                        }
                      }}
                    />
                    <datalist id={`produtos-list-${idx}`}>
                      {produtos.map((p) => (
                        <option key={p.id} value={p.nome} />
                      ))}
                    </datalist>
                  </div>

                  <div style={{ width: 120 }}>
                    <input
                      className={styles.input}
                      type="number"
                      step="0.01"
                      min="0"
                      value={it.preco}
                      onChange={(e) => alterarItem(idx, "preco", e.target.value)}
                    />
                  </div>

                  <div style={{ width: 100 }}>
                    <input
                      className={styles.input}
                      type="number"
                      min="1"
                      value={it.quantidade}
                      onChange={(e) => alterarItem(idx, "quantidade", e.target.value)}
                    />
                  </div>

                  <div style={{ width: 120, textAlign: "right", fontWeight: 600 }}>
                    {formatCurrency(Number(it.preco || 0) * Number(it.quantidade || 0))}
                  </div>

                  <div>
                    <button type="button" className={styles.botaoCancelar} onClick={() => removerItem(idx)}>
                      Remover
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <button type="button" className={styles.botaoEnviar} onClick={adicionarItem} disabled={submitting}>
                  Adicionar Item
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <div>
                <strong>Total: </strong>
                <span style={{ fontSize: 18, marginLeft: 8 }}>{formatCurrency(calcularTotal())}</span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className={styles.botaoCancelar} onClick={onClose} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" className={styles.botaoEnviar} disabled={submitting || form.itens.length === 0 || !form.clienteId}>
                  {submitting ? "Salvando..." : "Salvar Orçamento"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
