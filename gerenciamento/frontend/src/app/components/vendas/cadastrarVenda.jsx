"use client";
import { useState, useEffect, useRef } from "react";
import styles from "../../styles/cadastrarVenda.module.css";
import CadastrarCliente from "../clientes/cadastrarCliente";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function CadastrarVenda({ onClose }) {
  const [produtos, setProdutos] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [produtoBusca, setProdutoBusca] = useState("");
  const [clienteBusca, setClienteBusca] = useState("");
  const [funcionarioBusca, setFuncionarioBusca] = useState("");
  const [clientesLista, setClientesLista] = useState([]);
  const [funcionariosLista, setFuncionariosLista] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState("1");
  const [tipoEntrega, setTipoEntrega] = useState("entrega");
  const [dataEntrega, setDataEntrega] = useState("");
  const [novoProdutoQuantidade, setNovoProdutoQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showCadastrarCliente, setShowCadastrarCliente] = useState(false);

  const produtoInputRef = useRef(null);
  const clienteInputRef = useRef(null);
  const funcionarioInputRef = useRef(null);

  useEffect(() => {
    carregarProdutos();
    carregarClientes();
    carregarFuncionarios();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_produtos");
      const data = await res.json();
      const produtosFormatados = (data || []).map((p) => ({
        id: p[0],
        nome: p[1],
        preco: Number(p[4]),
        quantidadeEstoque: Number(p[5]) || 0,
      }));
      setProdutosDisponiveis(produtosFormatados);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarClientes = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_clientes");
      const data = await res.json();
      const rows = data.detalhes || data;
      const clientesFormatados = (rows || []).map((c) => ({
        id: c[0],
        nome: c[2] || c.nome || `Cliente ${c[0]}`,
      }));
      setClientesLista(clientesFormatados);
    } catch (err) {
      console.error(err);
      setClientesLista([]);
    }
  };

  const carregarFuncionarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_funcionarios");
      const data = await res.json();
      const funcionariosFormatados = (data || []).map((f) => ({
        id: f[0],
        nome: f[1] || `Funcionário ${f[0]}`,
      }));
      setFuncionariosLista(funcionariosFormatados);
    } catch (err) {
      console.error(err);
      setFuncionariosLista([]);
    }
  };

  const subtotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  const handleRemover = (index) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const handleQuantidade = (index, delta) => {
    const novos = [...produtos];
    novos[index].quantidade = Math.max(1, novos[index].quantidade + delta);
    setProdutos(novos);
  };

  const handleAdicionarProduto = (produto) => {
    if (!produto) return;
    const jaAdicionado = produtos.find((p) => p.id === produto.id);
    if (jaAdicionado) return alert("Produto já adicionado!");
    setProdutos([
      ...produtos,
      { ...produto, quantidade: novoProdutoQuantidade || 1 },
    ]);
    setProdutoBusca("");
    setNovoProdutoQuantidade(1);
  };

  const handleConfirmarVenda = async () => {
    if (!clienteSelecionado) return alert("Selecione um cliente");
    if (!funcionarioSelecionado) return alert("Selecione um funcionário");
    if (produtos.length === 0) return alert("Adicione pelo menos um produto");
    if (tipoEntrega === "entrega" && !dataEntrega)
      return alert("Informe a data de entrega");

    setLoading(true);
    setErrorMsg(null);

    try {
      const dataVenda = new Date().toISOString().split("T")[0];
      const payload = {
        cliente: parseInt(clienteSelecionado),
        funcionario: parseInt(funcionarioSelecionado),
        produtos: produtos.map((p) => ({ id: p.id, quantidade: p.quantidade })),
        valorTotal: subtotal,
        dataVenda,
        entrega: tipoEntrega === "entrega",
        dataEntrega: tipoEntrega === "entrega" ? dataEntrega : null,
      };

      const res = await fetch("http://localhost:5000/criar_venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao criar venda");

      // reduzir estoque
      for (const item of produtos) {
        const prod = produtosDisponiveis.find((p) => p.id === item.id);
        if (prod) {
          const newQty = Math.max(0, prod.quantidadeEstoque - item.quantidade);
          await fetch(`http://localhost:5000/editar_produto/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantidadeEstoque: newQty }),
          });
        }
      }

      alert("Venda criada com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao criar venda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nova venda</h2>
          <button className={styles.cancelar} onClick={onClose}>
            Cancelar
          </button>
        </div>

        {/* ================= CLIENTE ================= */}
        <label className={styles.titulo}>Cliente</label>
        <div className={styles.inlineSearch} ref={clienteInputRef}>
          <input
            type="text"
            className={styles.input}
            placeholder="Pesquisar cliente..."
            value={clienteBusca}
            onChange={(e) => setClienteBusca(e.target.value)}
          />
          <button
            className={styles.botaoRoxo}
            onClick={() => setShowCadastrarCliente(true)}
          >
            Novo cliente
          </button>

          {clienteBusca && (
            <div className={styles.dropdown}>
              {clientesLista
                .filter((c) =>
                  c.nome.toLowerCase().startsWith(clienteBusca.toLowerCase())
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setClienteSelecionado(c.id);
                      setClienteBusca(c.nome);
                    }}
                  >
                    {c.nome} (ID: {c.id})
                  </div>
                ))}
            </div>
          )}
        </div>

        {clienteSelecionado && (
          <div className={styles.clienteSelecionado}>
            <span>
              Cliente selecionado: <strong>{clienteBusca}</strong>
            </span>
            <button
              className={styles.removerCliente}
              onClick={() => {
                setClienteSelecionado(null);
                setClienteBusca("");
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

        {/* ================= FUNCIONÁRIO ================= */}
        <label className={styles.titulo}>Funcionário</label>
        <div className={styles.inlineSearch} ref={funcionarioInputRef}>
          <input
            type="text"
            className={styles.input}
            placeholder="Pesquisar funcionário..."
            value={funcionarioBusca}
            onChange={(e) => setFuncionarioBusca(e.target.value)}
          />
          {funcionarioBusca && (
            <div className={styles.dropdown}>
              {funcionariosLista
                .filter((f) =>
                  f.nome
                    .toLowerCase()
                    .startsWith(funcionarioBusca.toLowerCase())
                )
                .map((f) => (
                  <div
                    key={f.id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setFuncionarioSelecionado(f.id);
                      setFuncionarioBusca(f.nome);
                    }}
                  >
                    {f.nome} (ID: {f.id})
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ================= PRODUTOS ================= */}
        <h3 className={styles.titulo}>Produtos</h3>
        <div className={styles.novoProdutoForm} ref={produtoInputRef}>
          <input
            type="text"
            className={styles.input}
            placeholder="Pesquisar produto..."
            value={produtoBusca}
            onChange={(e) => setProdutoBusca(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={novoProdutoQuantidade}
            onChange={(e) =>
              setNovoProdutoQuantidade(
                Math.max(1, parseInt(e.target.value) || 1)
              )
            }
          />
          {produtoBusca && (
            <div className={styles.dropdown}>
              {produtosDisponiveis
                .filter((p) =>
                  p.nome.toLowerCase().startsWith(produtoBusca.toLowerCase())
                )
                .map((p) => (
                  <div
                    key={p.id}
                    className={styles.dropdownItem}
                    onClick={() => handleAdicionarProduto(p)}
                  >
                    {p.nome} - R${p.preco.toFixed(2)}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className={styles.produtoContainer}>
          <div className={styles.headerProdutos}>
            <span>Produto</span>
            <span>Quantidade</span>
            <span>Valor Unit.</span>
            <span>Valor</span>
            <span></span>
          </div>
          {produtos.map((produto, index) => (
            <div key={index} className={styles.produtoItem}>
              <span>{produto.nome}</span>
              <div className={styles.quantidadeControls}>
                <button onClick={() => handleQuantidade(index, -1)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span>{produto.quantidade}</span>
                <button onClick={() => handleQuantidade(index, 1)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <span>R${produto.preco.toFixed(2)}</span>
              <span>R${(produto.preco * produto.quantidade).toFixed(2)}</span>
              <button
                className={styles.trashButton}
                onClick={() => handleRemover(index)}
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

        {/* ================= ENTREGA / RETIRADA ================= */}
        <div className={styles.entregaBox}>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                className={styles.radioInput}
                value="entrega"
                checked={tipoEntrega === "entrega"}
                onChange={() => setTipoEntrega("entrega")}
              />
              Entrega
            </label>
            <label>
              <input
                type="radio"
                className={styles.radioInput}
                value="retirada"
                checked={tipoEntrega === "retirada"}
                onChange={() => setTipoEntrega("retirada")}
              />
              Retirada
            </label>
          </div>

          {tipoEntrega === "entrega" && (
            <div className={styles.entregaCampos}>
              <div className={styles.row}>
                <label className={styles.labelCinza}>Data da entrega</label>
                <input
                  type="date"
                  className={styles.inputEntrega}
                  value={dataEntrega}
                  onChange={(e) => setDataEntrega(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</p>
        )}

        <button
          className={styles.confirmarVenda}
          onClick={handleConfirmarVenda}
          disabled={loading}
        >
          {loading ? "Criando..." : "Confirmar Venda"}
        </button>

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
    </div>
  );
}

