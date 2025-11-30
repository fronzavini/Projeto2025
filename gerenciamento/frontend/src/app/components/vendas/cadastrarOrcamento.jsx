"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css"; // usar mesmo CSS
import CadastrarCliente from "../clientes/cadastrarCliente";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const API = "http://127.0.0.1:5000";

export default function CadastrarOrcamento({ onClose, onConfirm }) {
  const [clientesLista, setClientesLista] = useState([]);
  const [funcionariosLista, setFuncionariosLista] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [funcionarioId, setFuncionarioId] = useState("1");
  const [produtos, setProdutos] = useState([]);
  const [novoProdutoId, setNovoProdutoId] = useState("");
  const [novoProdutoQuantidade, setNovoProdutoQuantidade] = useState(1);
  const [showCadastrarCliente, setShowCadastrarCliente] = useState(false);
  const [form, setForm] = useState({ observacoes: "", pago: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarClientes();
    carregarFuncionarios();
    carregarProdutos();
  }, []);

  const carregarClientes = async () => {
    try {
      const res = await fetch(`${API}/listar_clientes`);
      const data = await res.json();
      const lista = (data.detalhes || data).map((c) => ({
        id: c[0],
        nome: c[2] || c.nome || `Cliente ${c[0]}`,
      }));
      setClientesLista(lista);
    } catch (err) {
      console.error(err);
      setClientesLista([]);
    }
  };

  const carregarFuncionarios = async () => {
    try {
      const res = await fetch(`${API}/listar_funcionarios`);
      const data = await res.json();
      const lista = (data || []).map((f) => ({
        id: f[0],
        nome: f[1] || `Funcionario ${f[0]}`,
      }));
      setFuncionariosLista(lista);
      if (!funcionarioId && lista.length)
        setFuncionarioId(lista[0].id.toString());
    } catch (err) {
      console.error(err);
      setFuncionariosLista([]);
    }
  };

  const carregarProdutos = async () => {
    try {
      const res = await fetch(`${API}/listar_produtos`);
      const data = await res.json();
      const lista = (data || []).map((p) => ({
        id: p[0],
        nome: p[1],
        preco: Number(p[4] || 0),
      }));
      setProdutosDisponiveis(lista);
    } catch (err) {
      console.error(err);
      setProdutosDisponiveis([]);
    }
  };

  const subtotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  const handleAdicionarProduto = () => {
    if (!novoProdutoId) return;
    const p = produtosDisponiveis.find(
      (prod) => String(prod.id) === String(novoProdutoId)
    );
    if (!p) return;
    setProdutos([...produtos, { ...p, quantidade: novoProdutoQuantidade }]);
    setNovoProdutoId("");
    setNovoProdutoQuantidade(1);
  };

  const handleRemover = (index) =>
    setProdutos(produtos.filter((_, i) => i !== index));

  const handleQuantidade = (index, delta) => {
    const novos = [...produtos];
    novos[index].quantidade = Math.max(1, novos[index].quantidade + delta);
    setProdutos(novos);
  };

  const handleConfirmar = async () => {
    if (!clienteSelecionado) {
      alert("Selecione um cliente");
      return;
    }
    if (produtos.length === 0) {
      alert("Adicione pelo menos um produto");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cliente: parseInt(clienteSelecionado),
        funcionario: parseInt(funcionarioId),
        produtos: produtos.map((p) => ({ id: p.id, quantidade: p.quantidade })),
        valorTotal: subtotal,
        dataVenda: new Date().toISOString().split("T")[0],
        entrega: false,
        dataEntrega: null,
        tipo: "orcamento",
        pago: !!form.pago,
        observacoes: form.observacoes,
      };

      const res = await fetch(`${API}/criar_venda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao criar orçamento");

      alert("Orçamento criado com sucesso!");
      if (onConfirm) onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao criar orçamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Novo Orçamento</h2>
          <button className={styles.cancelar} onClick={onClose}>
            Cancelar
          </button>
        </div>

        {/* Cliente */}
        <label className={styles.titulo}>Cliente</label>
        <div className={styles.inlineSearch}>
          <select
            className={styles.input}
            value={clienteSelecionado || ""}
            onChange={(e) => setClienteSelecionado(e.target.value)}
          >
            <option value="">Selecione um cliente</option>
            {clientesLista.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.nome}
              </option>
            ))}
          </select>
          <button
            className={styles.botaoRoxo}
            onClick={() => setShowCadastrarCliente(true)}
          >
            Novo cliente
          </button>
        </div>
        {clienteSelecionado && (
          <div className={styles.clienteSelecionado}>
            <span>
              Cliente selecionado ID: <strong>{clienteSelecionado}</strong>
            </span>
            <button
              className={styles.removerCliente}
              onClick={() => setClienteSelecionado(null)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

        {/* Funcionário */}
        <label className={styles.titulo}>Funcionário</label>
        <select
          className={styles.input}
          value={funcionarioId}
          onChange={(e) => setFuncionarioId(e.target.value)}
        >
          {funcionariosLista.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome} (ID:{f.id})
            </option>
          ))}
        </select>

        {/* Produtos */}
        <h3 className={styles.titulo}>Produtos</h3>
        <div className={styles.novoProdutoForm}>
          <select
            value={novoProdutoId}
            onChange={(e) => setNovoProdutoId(e.target.value)}
          >
            <option value="">Selecione um produto</option>
            {produtosDisponiveis.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} - R${p.preco.toFixed(2)}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={novoProdutoQuantidade}
            onChange={(e) =>
              setNovoProdutoQuantidade(
                Math.max(1, parseInt(e.target.value) || 1)
              )
            }
          />
          <button className={styles.botaoRoxo} onClick={handleAdicionarProduto}>
            Adicionar Produto
          </button>
        </div>

        <div className={styles.produtoContainer}>
          <div className={styles.headerProdutos}>
            <span>Produto</span>
            <span>Quantidade</span>
            <span>Valor Unit.</span>
            <span>Valor</span>
            <span></span>
          </div>
          {produtos.map((p, idx) => (
            <div key={idx} className={styles.produtoItem}>
              <span>{p.nome}</span>
              <div className={styles.quantidadeControls}>
                <button onClick={() => handleQuantidade(idx, -1)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span>{p.quantidade}</span>
                <button onClick={() => handleQuantidade(idx, 1)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <span>R${p.preco.toFixed(2)}</span>
              <span>R${(p.preco * p.quantidade).toFixed(2)}</span>
              <button
                className={styles.trashButton}
                onClick={() => handleRemover(idx)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>R${subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Observações e pago */}
        <div style={{ marginTop: 12 }}>
          <label className={styles.label}>Observações</label>
          <textarea
            className={styles.input}
            rows={3}
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
            }}
          >
            <input
              type="checkbox"
              checked={form.pago}
              onChange={(e) => setForm({ ...form, pago: e.target.checked })}
            />
            <label>Pago</label>
          </div>
        </div>

        <button
          className={styles.confirmarVenda}
          onClick={handleConfirmar}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Confirmar Orçamento"}
        </button>
      </div>

      {showCadastrarCliente && (
        <div className={styles.modalWrapper}>
          <CadastrarCliente
            onClose={() => {
              setShowCadastrarCliente(false);
              carregarClientes();
            }}
          />
        </div>
      )}
    </div>
  );
}
