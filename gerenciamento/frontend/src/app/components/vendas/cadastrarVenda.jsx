"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css";
import CadastrarCliente from "../clientes/cadastrarCliente";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function CadastrarVenda({ onClose }) {
  const [produtos, setProdutos] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteId, setClienteId] = useState("");
  const [clienteBusca, setClienteBusca] = useState("");
  const [clientesLista, setClientesLista] = useState([]);
  const [showCadastrarCliente, setShowCadastrarCliente] = useState(false);
  const [funcionariosLista, setFuncionariosLista] = useState([]);
  const [funcionarioId, setFuncionarioId] = useState("1");
  const [tipoEntrega, setTipoEntrega] = useState("entrega");
  const [dataEntrega, setDataEntrega] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [novoProdutoId, setNovoProdutoId] = useState("");
  const [novoProdutoQuantidade, setNovoProdutoQuantidade] = useState(1);

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    carregarClientes();
    carregarFuncionarios();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_produtos", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      const resultado = await res.json();
      const produtosFormatados = (resultado || []).map((p) => ({
        id: p[0],
        nome: p[1],
        preco: Number(p[4]),
        quantidadeEstoque: Number(p[5]) || 0,
      }));
      setProdutosDisponiveis(produtosFormatados);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  const carregarClientes = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_clientes", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao carregar clientes");
      const resultado = await res.json();
      // API retorna { resultado: 'ok', detalhes: [...] }
      const rows = resultado.detalhes || resultado;
      const clientesFormatados = (rows || []).map((c) => ({
        id: c[0],
        nome: c[2] || c.nome || `Cliente ${c[0]}`,
      }));
      setClientesLista(clientesFormatados);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setClientesLista([]);
    }
  };

  const carregarFuncionarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_funcionarios", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Erro ao carregar funcionários");
      const resultado = await res.json();
      const rows = resultado || [];
      const funcionariosFormatados = (rows || []).map((f) => ({
        id: f[0],
        nome: f[1] || `Funcionario ${f[0]}`,
      }));
      setFuncionariosLista(funcionariosFormatados);
      // se não houver funcionarioId definido, usar primeiro
      if (!funcionarioId && funcionariosFormatados.length > 0) {
        setFuncionarioId(funcionariosFormatados[0].id.toString());
      }
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
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

  const handleAdicionarProduto = () => {
    if (novoProdutoId && novoProdutoQuantidade > 0) {
      const produtoEncontrado = produtosDisponiveis.find(
        (p) => p.id.toString() === novoProdutoId
      );
      if (produtoEncontrado) {
        setProdutos([
          ...produtos,
          {
            id: produtoEncontrado.id,
            nome: produtoEncontrado.nome,
            preco: produtoEncontrado.preco,
            quantidade: novoProdutoQuantidade,
          },
        ]);
        setNovoProdutoId("");
        setNovoProdutoQuantidade(1);
      }
    }
  };

  const handleAdicionarCliente = () => {
    if (clienteId.trim()) {
      setClienteSelecionado(clienteId);
      setClienteBusca("");
    }
  };

  const handleConfirmarVenda = async () => {
    if (!clienteSelecionado) {
      alert("Selecione um cliente");
      return;
    }
    if (produtos.length === 0) {
      alert("Adicione pelo menos um produto");
      return;
    }
    if (tipoEntrega === "entrega" && !dataEntrega) {
      alert("Informe a data de entrega");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const dataVenda = new Date().toISOString().split("T")[0];
      const payload = {
        cliente: parseInt(clienteSelecionado),
        funcionario: parseInt(funcionarioId),
        produtos: produtos.map((p) => ({ id: p.id, quantidade: p.quantidade })),
        valorTotal: subtotal,
        dataVenda: dataVenda,
        entrega: tipoEntrega === "entrega",
        dataEntrega: tipoEntrega === "entrega" ? dataEntrega : null,
      };

      const res = await fetch("http://localhost:5000/criar_venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar venda");

      // registrar transacao financeira se for compra física (retirada)
      if (tipoEntrega === "retirada") {
        try {
          await fetch("http://localhost:5000/criar_transacaofinanceira", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo: "entrada",
              categoria: "venda",
              descricao: `Venda (cliente ${clienteSelecionado})`,
              valor: subtotal,
              data: dataVenda,
            }),
          });
        } catch (err) {
          console.error("Erro ao registrar transacao financeira:", err);
        }
      }

      // reduzir estoque dos produtos vendidos
      for (const item of produtos) {
        try {
          const prodDisponivel = produtosDisponiveis.find((p) => p.id === item.id || p.id.toString() === item.id.toString());
          const currentQty = prodDisponivel ? Number(prodDisponivel.quantidadeEstoque || 0) : null;
          if (currentQty !== null) {
            const newQty = Math.max(0, currentQty - item.quantidade);
            await fetch(`http://localhost:5000/editar_produto/${item.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantidadeEstoque: newQty }),
            });
          }
        } catch (err) {
          console.error(`Erro ao reduzir estoque do produto ${item.id}:`, err);
        }
      }

      alert("Venda criada com sucesso!");
      onClose();
    } catch (err) {
      console.error("Erro:", err);
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

        <label className={styles.titulo}>Cliente</label>
        <div className={styles.inlineSearch}>
          <select
            className={styles.input}
            value={clienteSelecionado ?? ""}
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
              title="Remover cliente"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

          <label className={styles.titulo}>Funcionário</label>
          <select
            className={styles.input}
            value={funcionarioId}
            onChange={(e) => setFuncionarioId(e.target.value)}
          >
            <option value="">Selecione um funcionário</option>
            {funcionariosLista.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome} (ID:{f.id})
              </option>
            ))}
          </select>

        <h3 className={styles.titulo}>Produtos</h3>
        <label>Adicionar Produto</label>
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
            placeholder="Quantidade"
            value={novoProdutoQuantidade}
            onChange={(e) =>
              setNovoProdutoQuantidade(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="1"
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

        <div className={styles.entregaBox}>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="entrega"
                checked={tipoEntrega === "entrega"}
                onChange={() => setTipoEntrega("entrega")}
              />
              Entrega
            </label>
            <label>
              <input
                type="radio"
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