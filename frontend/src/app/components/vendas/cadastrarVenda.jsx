"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css";

export default function CadastrarVenda({ onClose, onSuccess }) {
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [tipoEntrega, setTipoEntrega] = useState("entrega");
  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [cliente, setCliente] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [dataVenda, setDataVenda] = useState("");
  const [entrega, setEntrega] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");

  // Carrega os produtos cadastrados no backend
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const resp = await fetch("http://localhost:5000/listar_produtos");
        if (!resp.ok) throw new Error();
        const resultado = await resp.json();
        setProdutosDisponiveis(resultado);
      } catch {
        alert("Erro ao carregar produtos.");
      }
    };
    carregarProdutos();
  }, []);

  // Adiciona produto selecionado à lista de produtos da venda
  const handleAdicionarProduto = () => {
    if (!produtoId || quantidade < 1) return;
    const produto = produtosDisponiveis.find((p) => p.id === Number(produtoId));
    if (!produto) return;
    setProdutosSelecionados((prev) => [
      ...prev,
      {
        id: produto.id,
        nome: produto.nome,
        quantidade,
        valorUnit: produto.preco,
      },
    ]);
    setProdutoId("");
    setQuantidade(1);
  };

  // Remove produto da lista de produtos da venda
  const handleRemoverProduto = (id) => {
    setProdutosSelecionados((prev) => prev.filter((p) => p.id !== id));
  };

  // Envia a venda para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (produtosSelecionados.length === 0) {
      alert("Adicione pelo menos um produto à venda.");
      return;
    }
    const venda = {
      cliente,
      funcionario,
      produtos: produtosSelecionados,
      tipoEntrega,
      formaPagamento,
      dataVenda,
      entrega,
      dataEntrega,
    };
    try {
      const resp = await fetch("http://localhost:5000/criar_venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });
      if (!resp.ok) throw new Error();
      alert("Venda cadastrada com sucesso!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch {
      alert("Erro ao cadastrar venda.");
    }
  };

  return (
    <div className={styles.modal}>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <h2>Cadastrar Venda</h2>
        <input
          name="cliente"
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          required
        />
        <input
          name="funcionario"
          placeholder="Funcionário"
          value={funcionario}
          onChange={(e) => setFuncionario(e.target.value)}
          required
        />
        <input
          name="dataVenda"
          placeholder="Data da Venda (YYYY-MM-DD)"
          value={dataVenda}
          onChange={(e) => setDataVenda(e.target.value)}
          required
        />
        <input
          name="entrega"
          placeholder="Entrega"
          value={entrega}
          onChange={(e) => setEntrega(e.target.value)}
        />
        <input
          name="dataEntrega"
          placeholder="Data da Entrega (YYYY-MM-DD)"
          value={dataEntrega}
          onChange={(e) => setDataEntrega(e.target.value)}
        />
        <select
          value={tipoEntrega}
          onChange={(e) => setTipoEntrega(e.target.value)}
        >
          <option value="entrega">Entrega</option>
          <option value="balcao">Balcão</option>
        </select>
        <select
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
        >
          <option value="Pix">Pix</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão">Cartão</option>
        </select>
        <h3>Produtos</h3>
        <div className={styles.produtoSelector}>
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
          >
            <option value="">Selecione um produto</option>
            {produtosDisponiveis.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} (R$ {Number(p.preco).toFixed(2)})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            placeholder="Quantidade"
          />
          <button type="button" onClick={handleAdicionarProduto}>
            Adicionar Produto
          </button>
        </div>
        <ul>
          {produtosSelecionados.map((p) => (
            <li key={p.id}>
              {p.nome} - {p.quantidade} x R$ {Number(p.valorUnit).toFixed(2)}
              <button
                type="button"
                onClick={() => handleRemoverProduto(p.id)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.botoes}>
          <button type="submit">Cadastrar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}