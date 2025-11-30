"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css";
import CadastrarCliente from "../clientes/cadastrarCliente";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DropdownSelect from "./dropdownSelect";
import DropdownProduto from "./dropdownProduto";

export default function CadastrarVenda({ onClose }) {
  const [produtos, setProdutos] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [clientesLista, setClientesLista] = useState([]);
  const [funcionariosLista, setFuncionariosLista] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [clienteBusca, setClienteBusca] = useState("");
  const [funcionarioBusca, setFuncionarioBusca] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("entrega");
  const [dataEntrega, setDataEntrega] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showCadastrarCliente, setShowCadastrarCliente] = useState(false);

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

        <div className={styles.dropdownContainer}>
          <DropdownSelect
            label="Cliente"
            placeholder="Pesquisar cliente..."
            lista={clientesLista}
            value={clienteBusca}
            selectedId={clienteSelecionado}
            onChange={setClienteBusca}
            onSelect={setClienteSelecionado}
            onClear={() => {
              setClienteSelecionado(null);
              setClienteBusca("");
            }}
            allowNew={true}
            onNewClick={() => setShowCadastrarCliente(true)}
          />
        </div>

        <div className={styles.dropdownContainer}>
          <DropdownSelect
            label="Funcionário"
            placeholder="Pesquisar funcionário..."
            lista={funcionariosLista}
            value={funcionarioBusca}
            selectedId={funcionarioSelecionado}
            onChange={setFuncionarioBusca}
            onSelect={setFuncionarioSelecionado}
            onClear={() => {
              setFuncionarioSelecionado(null);
              setFuncionarioBusca("");
            }}
          />
        </div>

        {/* PRODUTOS */}
        <h3 className={styles.titulo}>Produtos</h3>
        <DropdownProduto
          lista={produtosDisponiveis}
          onAdicionar={(produto) => {
            const jaAdicionado = produtos.find((p) => p.id === produto.id);
            if (jaAdicionado) return alert("Produto já adicionado!");
            setProdutos([...produtos, produto]);
          }}
        />

        {/* LISTA DE PRODUTOS */}
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
                <button onClick={() => handleQuantidade(index, -1)}>-</button>
                <span>{produto.quantidade}</span>
                <button onClick={() => handleQuantidade(index, 1)}>+</button>
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

        {/* ENTREGA / RETIRADA */}
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
              <label className={styles.labelCinza}>Data da entrega</label>
              <input
                type="date"
                className={styles.inputEntrega}
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
              />
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

        {/* MODAL NOVO CLIENTE */}
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
