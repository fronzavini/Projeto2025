"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function CadastrarOrcamento({ onClose }) {
  const [produtos, setProdutos] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteId, setClienteId] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [novoProdutoId, setNovoProdutoId] = useState("");
  const [novoProdutoQuantidade, setNovoProdutoQuantidade] = useState(1);

  useEffect(() => {
    carregarProdutos();
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
      }));
      setProdutosDisponiveis(produtosFormatados);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
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
    }
  };

  const handleConfirmarOrcamento = async () => {
    if (!clienteSelecionado) {
      alert("Selecione um cliente");
      return;
    }
    if (produtos.length === 0) {
      alert("Adicione pelo menos um produto");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        cliente: parseInt(clienteSelecionado),
        funcionario: parseInt(funcionarioId),
        produtos: produtos.map((p) => ({ id: p.id, quantidade: p.quantidade })),
        valorTotal: subtotal,
        dataVenda: new Date().toISOString().split("T")[0],
        entrega: false,
        dataEntrega: null,
      };

      const res = await fetch("http://localhost:5000/criar_venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar orçamento");

      alert("Orçamento criado com sucesso!");
      onClose();
    } catch (err) {
      console.error("Erro:", err);
      setErrorMsg("Erro ao criar orçamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Novo orçamento</h2>
          <button className={styles.cancelar} onClick={onClose}>
            Cancelar
          </button>
        </div>

        <label className={styles.titulo}>Cliente ID</label>
        <div className={styles.inlineSearch}>
          <input
            className={styles.input}
            placeholder="ID do Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          />
          <button className={styles.botaoRoxo} onClick={handleAdicionarCliente}>
            Adicionar
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

        <label className={styles.titulo}>Funcionário ID</label>
        <input
          className={styles.input}
          type="number"
          value={funcionarioId}
          onChange={(e) => setFuncionarioId(e.target.value)}
          min="1"
        />

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

        {errorMsg && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</p>
        )}

        <button
          className={styles.confirmarVenda}
          onClick={handleConfirmarOrcamento}
          disabled={loading}
        >
          {loading ? "Criando..." : "Confirmar Orçamento"}
        </button>
      </div>
    </div>
  );
}

        <div className={styles.resumo}>
          <div className={styles.resumoItem}>
            <span>Subtotal</span>
            <span className={styles.valorDireita}>R${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.resumoItem}>
            <span>Desconto</span>
            <span className={styles.valorDireita}>R$00,00</span>
          </div>
          <div className={styles.resumoItem}>
            <span>Total</span>
            <span className={styles.valorDireita}>R${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <label className={styles.titulo}>Forma de Pagamento</label>
        <select
          className={styles.select}
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
        >
          <option>Pix</option>
          <option>Espécie</option>
        </select>

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
                <label className={styles.labelCinza}>Endereço da entrega</label>
                <input type="text" className={styles.inputEntrega} />
              </div>
              <div className={styles.row}>
                <label className={styles.labelCinza}>Data da entrega</label>
                <input type="date" className={styles.inputEntrega} />
              </div>
              <div className={styles.row}>
                <label className={styles.labelCinza}>Frete</label>
                <span className={styles.valorDireita}>R$00,00</span>
              </div>
            </div>
          )}
        </div>

        <button className={styles.confirmarVenda}>Cadastrar orçamento</button>
      </div>
    </div>
  );
}