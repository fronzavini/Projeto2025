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

  // Subtotal dos produtos
  const subtotal = produtos.reduce((acc, p) => acc + Number(p.preco || 0) * Number(p.quantidade || 0), 0);

  // Carregar dados iniciais
  useEffect(() => {
    carregarProdutos();
    carregarClientes();
    carregarFuncionarios();
    carregarCupons();
  }, []);

  // Recalcular desconto sempre que produtos ou cupom mudarem
  useEffect(() => {
    if (cupomSelecionado) {
      aplicarCupom(cupomSelecionado);
    } else {
      setDesconto(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produtos, cupomSelecionado]);

  // -------------------- CARREGAR DADOS --------------------
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
        // normaliza vários formatos possíveis do backend
        id: c.id ?? c[0],
        nome: c.codigo ?? c.nome ?? String(c.id ?? c[0]),
        tipo: (c.tipo ?? c.type ?? "").toString(),
        descontofixo: Number(c.desconto_fixo ?? c.descontofixo ?? c.desconto ?? 0),
        descontoPorcentagem: Number(c.desconto_percentual ?? c.descontoPorcentagem ?? c.descontoPercent ?? 0),
        descontofrete: Number(c.desconto_frete ?? c.descontofrete ?? 0),
        validade: c.validade ?? c.data_validade ?? c.dataValidade ?? null,
        usos_permitidos: c.usos_permitidos ?? c.usosPermitidos ?? null,
        valor_minimo: Number(c.valor_minimo ?? c.valorMinimo ?? 0),
        aplicacao: (c.aplicacao ?? c.aplicacao_tipo ?? c.aplicacaoTipo ?? "todos").toString(),
        tipo_produto: (c.tipo_produto ?? c.tipoProduto ?? c.produto ?? "").toString(),
      }));
      setCuponsLista(cuponsFormatados);
    } catch (err) {
      console.error(err);
      setCuponsLista([]);
    }
  };

  // -------------------- PRODUTOS --------------------
  const handleRemover = (index) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const handleQuantidade = (index, delta) => {
    const novos = [...produtos];
    novos[index].quantidade = Math.max(1, Number(novos[index].quantidade || 0) + delta);
    setProdutos(novos);
  };

  // -------------------- CUPOM --------------------
  // retorna { valido: boolean, motivo?: string, desconto?: number }
  const validarCupom = (cupom, produtosList, subtotalValue) => {
    if (!cupom) return { valido: false, motivo: "Cupom inválido." };

    const tipoCupom = String(cupom.tipo || "").toLowerCase().trim();
    const aplicacao = String(cupom.aplicacao || "").toLowerCase().trim();
    const tipoProdutoCupom = String(cupom.tipo_produto || cupom.tipoProduto || "").toLowerCase().trim();

    // Validade - tenta normalizar datas similares a "YYYY-MM-DD"
    if (cupom.validade) {
      try {
        const hoje = new Date().toISOString().split("T")[0];
        const validadeStr = String(cupom.validade).split("T")[0];
        if (validadeStr < hoje) return { valido: false, motivo: "Cupom expirado." };
      } catch (e) {
        // se formato estranho, não bloqueia por validade
      }
    }

    // Valor mínimo
    if (Number(cupom.valor_minimo || cupom.valorMinimo || 0) && subtotalValue < Number(cupom.valor_minimo || cupom.valorMinimo || 0))
      return { valido: false, motivo: `Valor mínimo R$${Number(cupom.valor_minimo || cupom.valorMinimo || 0).toFixed(2)}` };

    // Filtrar produtos compatíveis
    const produtosValidos = produtosList.filter((p) => {
      const nomeProduto = String(p.nome || "").toLowerCase().trim();
      const categoriaProduto = String(p.categoria || p.categoria_produto || "").toLowerCase().trim();

      if (aplicacao === "todos" || aplicacao === "") return true;
      if (aplicacao === "tipo_produto" || aplicacao === "categoria") return categoriaProduto === tipoProdutoCupom;
      if (aplicacao === "produto") return nomeProduto === tipoProdutoCupom;
      // fallback: verifica se bate por nome ou categoria
      return categoriaProduto === tipoProdutoCupom || nomeProduto === tipoProdutoCupom;
    });

    if (produtosValidos.length === 0)
      return { valido: false, motivo: "Cupom não se aplica aos produtos selecionados." };

    // Calcular total dos produtos válidos
    const totalValidos = produtosValidos.reduce((acc, p) => acc + Number(p.preco || 0) * Number(p.quantidade || 0), 0);

    // tenta ler desconto nas propriedades possíveis
    const descontoFixo = Number(cupom.descontofixo ?? cupom.desconto_fixo ?? cupom.desconto ?? 0);
    const descontoPerc = Number(cupom.descontoPorcentagem ?? cupom.desconto_percentual ?? cupom.descontoPercent ?? 0);

    let descontoCalc = 0;
    if (tipoCupom.includes("fix") || tipoCupom.includes("valor") || descontoFixo > 0) {
      descontoCalc = Math.min(descontoFixo, totalValidos);
    } else if (tipoCupom.includes("percent") || tipoCupom.includes("%") || descontoPerc > 0) {
      descontoCalc = (totalValidos * descontoPerc) / 100;
    } else {
      // se backend não informou tipo, tenta inferir pelos campos
      if (descontoFixo > 0) descontoCalc = Math.min(descontoFixo, totalValidos);
      else if (descontoPerc > 0) descontoCalc = (totalValidos * descontoPerc) / 100;
      else descontoCalc = 0;
    }

    if (!isFinite(descontoCalc) || isNaN(descontoCalc)) descontoCalc = 0;

    // não pode exceder total válido
    descontoCalc = Math.max(0, Math.min(descontoCalc, totalValidos));

    // arredonda para 2 casas
    descontoCalc = Number(descontoCalc.toFixed(2));

    return { valido: true, desconto: descontoCalc };
  };

  // aplicarCupom aceita id ou objeto
  const aplicarCupom = (idOrObj) => {
    let cupom = null;
    if (!idOrObj) {
      setCupomSelecionado(null);
      setCupomBusca("");
      setDesconto(0);
      return;
    }
    // se receberam objeto direto
    if (typeof idOrObj === "object") cupom = idOrObj;
    else cupom = cuponsLista.find((c) => String(c.id) === String(idOrObj));

    if (!cupom) {
      // pode ser que onSelect passou um código (nome), tenta buscar por nome/codigo
      const maybe = cuponsLista.find((c) => String(c.nome).toLowerCase() === String(idOrObj).toLowerCase());
      if (maybe) cupom = maybe;
    }

    if (!cupom) {
      // não encontrado -> limpa
      setCupomSelecionado(null);
      setCupomBusca("");
      setDesconto(0);
      return;
    }

    const resultado = validarCupom(cupom, produtos, subtotal);
    if (!resultado.valido) {
      // mostra aviso e limpa seleção
      alert(resultado.motivo);
      setCupomSelecionado(null);
      setCupomBusca("");
      setDesconto(0);
      return;
    }

    // se válido, atualiza estado
    setCupomSelecionado(cupom.id);
    setCupomBusca(cupom.nome);
    setDesconto(resultado.desconto);
  };

  // -------------------- SALVAR VENDA --------------------
  const handleConfirmarVenda = async () => {
    if (!clienteSelecionado) return alert("Selecione um cliente");
    if (!funcionarioSelecionado) return alert("Selecione um funcionário");
    if (produtos.length === 0) return alert("Adicione pelo menos um produto");
    if (tipoEntrega === "entrega" && !dataEntrega) return alert("Informe a data de entrega");

    setLoading(true);
    setErrorMsg(null);

    try {
      const dataVenda = new Date().toISOString().split("T")[0];

      const payload = {
        cliente: parseInt(clienteSelecionado),
        funcionario: parseInt(funcionarioSelecionado),
        produtos: produtos.map((p) => ({ id: p.id, quantidade: p.quantidade })),
        valorTotal: Number((subtotal - desconto).toFixed(2)),
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

      // Baixar estoque
      for (const item of produtos) {
        const prod = produtosDisponiveis.find((p) => String(p.id) === String(item.id));
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

  // -------------------- JSX --------------------
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nova venda</h2>
          <button className={styles.cancelar} onClick={onClose}>Cancelar</button>
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
          onClear={() => { setClienteSelecionado(null); setClienteBusca(""); }}
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
          onClear={() => { setFuncionarioSelecionado(null); setFuncionarioBusca(""); }}
        />

        {/* PRODUTOS */}
        <h3 className={styles.titulo}>Produtos</h3>
        <DropdownProduto
          lista={produtosDisponiveis}
          onAdicionar={(produto) => {
            const jaAdicionado = produtos.find((p) => String(p.id) === String(produto.id));
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
              <span>R${Number(produto.preco || 0).toFixed(2)}</span>
              <span>R${(Number(produto.preco || 0) * Number(produto.quantidade || 0)).toFixed(2)}</span>
              <button className={styles.trashButton} onClick={() => handleRemover(index)}>
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
          onSelect={aplicarCupom}
          onClear={() => { setCupomSelecionado(null); setCupomBusca(""); setDesconto(0); }}
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
            <span className={styles.valorDireita}>R${(subtotal - desconto).toFixed(2)}</span>
          </div>
        </div>

        {/* ENTREGA */}
        <div className={styles.entregaBox}>
          <div className={styles.radioGroup}>
            <label>
              <input type="radio" value="entrega" checked={tipoEntrega === "entrega"} onChange={() => setTipoEntrega("entrega")} />
              Entrega
            </label>
            <label>
              <input type="radio" value="retirada" checked={tipoEntrega === "retirada"} onChange={() => setTipoEntrega("retirada")} />
              Retirada
            </label>
          </div>

          {tipoEntrega === "entrega" && (
            <div className={styles.entregaCampos}>
              <label className={styles.labelCinza}>Data da entrega</label>
              <input type="date" className={styles.inputEntrega} value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} />
            </div>
          )}
        </div>

        {/* FORMA DE PAGAMENTO */}
        <label className={styles.titulo}>Forma de Pagamento</label>
        <select className={styles.select} value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
          <option>Pix</option>
          <option>Espécie</option>
        </select>

        {errorMsg && <p style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</p>}

        <button className={styles.confirmarVenda} onClick={handleConfirmarVenda} disabled={loading}>
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
