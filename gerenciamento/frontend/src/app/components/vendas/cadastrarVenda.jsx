"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CadastrarCliente from "../clientes/cadastrarCliente";
import DropdownSelect from "./dropdownSelect";
import DropdownProduto from "./dropdownProduto";

export default function CadastrarVenda({ onClose }) {
  // Estados principais
  const [produtos, setProdutos] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [clientesLista, setClientesLista] = useState([]);
  const [funcionariosLista, setFuncionariosLista] = useState([]);
  const [cuponsLista, setCuponsLista] = useState([]);

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [cupomSelecionado, setCupomSelecionado] = useState(null);

  const [clienteBusca, setClienteBusca] = useState("");
  const [funcionarioBusca, setFuncionarioBusca] = useState("");
  const [cupomBusca, setCupomBusca] = useState("");

  const [tipoEntrega, setTipoEntrega] = useState("entrega");
  const [dataEntrega, setDataEntrega] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("Pix");

  const [desconto, setDesconto] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showCadastrarCliente, setShowCadastrarCliente] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    carregarProdutos();
    carregarClientes();
    carregarFuncionarios();
    carregarCupons();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_produtos");
      const data = await res.json();

      const produtosFormatados = (data || []).map((p) => ({
        id: p[0],
        nome: p[1],
        categoria: p[2],
        marca: p[3],
        preco: Number(p[4]),
        quantidadeEstoque: Number(p[5]) || 0,
        quantidade: 1,
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

  const carregarCupons = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_cupons");
      const data = await res.json();

      const cuponsFormatados = (data || []).map((c) => ({
        id: c.id || c[0],
        nome: c.codigo || c.nome || `Cupom ${c.id}`,
        tipo: c.tipo,
        descontofixo: c.descontofixo,
        descontoPorcentagem: c.descontoPorcentagem,
        descontofrete: c.descontofrete,
        validade: c.validade,
        usos_permitidos: c.usos_permitidos,
        valor_minimo: c.valor_minimo,
        aplicacao: c.aplicacao,
        tipo_produto: c.tipo_produto, // categoria OU nome do produto
      }));

      setCuponsLista(cuponsFormatados);
    } catch (err) {
      console.error(err);
      setCuponsLista([]);
    }
  };

  const subtotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  // Controle de produtos
  const handleRemover = (index) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const handleQuantidade = (index, delta) => {
    const novos = [...produtos];
    novos[index].quantidade = Math.max(1, novos[index].quantidade + delta);
    setProdutos(novos);
  };

  // --------------------------------------------------------------------
  //  CUPOM: VALIDAÇÃO
  // --------------------------------------------------------------------
  const validarCupom = (cupom, produtos, subtotal) => {
    if (!cupom) return { valido: false, motivo: "Cupom inválido." };

    // 1 - Validar data
    if (cupom.validade) {
      const hoje = new Date().toISOString().split("T")[0];
      if (cupom.validade < hoje) {
        return { valido: false, motivo: "Cupom expirado." };
      }
    }

    // 2 - Valor mínimo
    if (cupom.valor_minimo && subtotal < cupom.valor_minimo) {
      return {
        valido: false,
        motivo: `Valor mínimo para uso é R$${cupom.valor_minimo}.`,
      };
    }

    // 3 - Aplicação
    let produtosValidos = [];

    if (cupom.aplicacao === "todos") {
      produtosValidos = produtos;
    }

    // APLICAR POR CATEGORIA
    else if (cupom.aplicacao === "tipo_produto") {
      produtosValidos = produtos.filter(
        (p) =>
          p.categoria?.toLowerCase() ===
          cupom.tipo_produto?.toLowerCase()
      );
    }

    // APLICAR POR PRODUTO ESPECÍFICO
    else if (cupom.aplicacao === "produto") {
      produtosValidos = produtos.filter(
        (p) =>
          p.nome?.toLowerCase() ===
          cupom.tipo_produto?.toLowerCase()
      );
    }

    if (produtosValidos.length === 0) {
      return {
        valido: false,
        motivo: "Cupom não se aplica aos produtos selecionados.",
      };
    }

    // --------------------------------------------------------------------
    //  4 - Cálculo do desconto
    // --------------------------------------------------------------------
    let desconto = 0;

    if (cupom.tipo === "fixo") {
      desconto = Number(cupom.descontofixo || 0);

      const totalValidos = produtosValidos.reduce(
        (acc, p) => acc + p.preco * p.quantidade,
        0
      );

      desconto = Math.min(desconto, totalValidos);
    }

    if (cupom.tipo === "percentual") {
      const totalValidos = produtosValidos.reduce(
        (acc, p) => acc + p.preco * p.quantidade,
        0
      );
      desconto =
        (totalValidos * (cupom.descontoPorcentagem || 0)) / 100;
    }

    return { valido: true, desconto };
  };

  // Aplicar cupom
  const aplicarCupom = (id) => {
    const cupom = cuponsLista.find((c) => c.id === id);

    if (!cupom) {
      setCupomSelecionado(null);
      setDesconto(0);
      return;
    }

    const resultado = validarCupom(cupom, produtos, subtotal);

    if (!resultado.valido) {
      alert(resultado.motivo);
      setCupomSelecionado(null);
      setCupomBusca("");
      setDesconto(0);
      return;
    }

    setCupomSelecionado(cupom.id);
    setCupomBusca(cupom.nome);
    setDesconto(resultado.desconto);
  };

  // --------------------------------------------------------------------
  // SALVAR VENDA
  // --------------------------------------------------------------------
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
        produtos: produtos.map((p) => ({
          id: p.id,
          quantidade: p.quantidade,
        })),
        valorTotal: subtotal - desconto,
        cupom: cupomSelecionado,
        dataVenda,
        entrega: tipoEntrega === "entrega" ? 1 : 0,
        dataEntrega: tipoEntrega === "entrega" ? dataEntrega : null,
        formaPagamento,
        pago: 0,
      };

      const res = await fetch("http://localhost:5000/criar_venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar venda");

      // Baixar do estoque
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

  // --------------------------------------------------------------------
  // JSX
  // --------------------------------------------------------------------
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nova venda</h2>
          <button className={styles.cancelar} onClick={onClose}>
            Cancelar
          </button>
        </div>

        {/* CLIENTE */}
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
          allowNew
          onNewClick={() => setShowCadastrarCliente(true)}
        />

        {/* FUNCIONÁRIO */}
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
            <span className={styles.totalLabel}>Subtotal</span>
            <span className={styles.totalValue}>R${subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* CUPOM */}
        <label className={styles.titulo}>Adicionar Cupom</label>

        <DropdownSelect
          label="Cupom"
          placeholder="Buscar cupom..."
          lista={cuponsLista}
          value={cupomBusca}
          selectedId={cupomSelecionado}
          onChange={setCupomBusca}
          onSelect={(id) => aplicarCupom(id)}
          onClear={() => {
            setCupomSelecionado(null);
            setCupomBusca("");
            setDesconto(0);
          }}
        />

        {/* RESUMO */}
        <div className={styles.resumo}>
          <div className={styles.resumoItem}>
            <span>Subtotal</span>
            <span className={styles.valorDireita}>R${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.resumoItem}>
            <span>Desconto</span>
            <span className={styles.valorDireita}>R${desconto.toFixed(2)}</span>
          </div>
          <div className={styles.resumoItem}>
            <span>Total</span>
            <span className={styles.valorDireita}>
              R${(subtotal - desconto).toFixed(2)}
            </span>
          </div>
        </div>

        {/* ENTREGA */}
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

        {/* FORMA DE PAGAMENTO */}
        <label className={styles.titulo}>Forma de Pagamento</label>
        <select
          className={styles.select}
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
        >
          <option>Pix</option>
          <option>Espécie</option>
        </select>

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
