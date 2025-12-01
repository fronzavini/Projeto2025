"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CadastrarCliente from "../clientes/cadastrarCliente";
import DropdownSelect from "./dropdownSelect";
import DropdownProduto from "./dropdownProduto";

export default function CadastrarVenda({ onClose }) {
  // -------------------- ESTADOS PRINCIPAIS --------------------
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

  // -------------------- PIX: ESTADOS --------------------
  const [showPix, setShowPix] = useState(false);
  const [pixPaymentId, setPixPaymentId] = useState(null);
  const [pixQrBase64, setPixQrBase64] = useState("");
  const [pixStatus, setPixStatus] = useState("");

  // -------------------- DERIVADOS --------------------
  const subtotal = produtos.reduce(
    (acc, p) => acc + Number(p.preco || 0) * Number(p.quantidade || 0),
    0
  );

  // -------------------- CARREGAR DADOS INICIAIS --------------------
  useEffect(() => {
    carregarProdutos();
    carregarClientes();
    carregarFuncionarios();
    carregarCupons();
  }, []);

  // Recalcula desconto quando muda cupom/produtos
  useEffect(() => {
    if (cupomSelecionado) aplicarCupom(cupomSelecionado);
    else setDesconto(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produtos, cupomSelecionado]);

  // -------------------- FETCHS --------------------
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
      const lista = (data?.detalhes || data || []).map((c) => ({
        id: c.id || c[0],
        nome: c.nome || c[1] || c.cliente || "Cliente",
      }));
      setClientesLista(lista);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarFuncionarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_funcionarios");
      const data = await res.json();
      const lista = (data || []).map((f) => ({
        id: f.id || f[0],
        nome: f.nome || f[1] || "Funcionário",
      }));
      setFuncionariosLista(lista);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarCupons = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_cupons");
      const data = await res.json();
      const lista = (data || []).map((c) => ({
        id: c.id || c[0],
        nome: c.codigo || c[1],
        tipo: c.tipo || c[2],
        descontofixo: c.descontofixo || c[3],
        descontoPorcentagem: c.descontoPorcentagem || c[4],
        descontofrete: c.descontofrete || c[5],
        validade: c.validade || c[6],
        usos_permitidos: c.usos_permitidos || c[7],
        valor_minimo: c.valor_minimo || c[8],
        aplicacao: c.aplicacao || c[9],
        tipo_produto: c.tipo_produto || c[10],
      }));
      setCuponsLista(lista);
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------- PRODUTOS: QUANTIDADE / REMOÇÃO --------------------
  const handleQuantidade = (index, delta) => {
    const novos = [...produtos];
    const atual = { ...novos[index] };
    const novaQt = Math.max(1, Number(atual.quantidade || 1) + delta);
    atual.quantidade = novaQt;
    novos[index] = atual;
    setProdutos(novos);
  };

  const handleRemoverProduto = (index) => {
    const novos = [...produtos];
    novos.splice(index, 1);
    setProdutos(novos);
  };

  // -------------------- CUPOM --------------------
  const validarCupom = (cupom, itens, valorSubtotal) => {
    if (!cupom) return { valido: false, motivo: "Cupom inválido" };

    if (cupom.valor_minimo && Number(valorSubtotal) < Number(cupom.valor_minimo)) {
      return { valido: false, motivo: "Valor mínimo não atingido para este cupom." };
    }

    let descontoCalc = 0;

    if (String(cupom.tipo).toLowerCase() === "percentual") {
      const pct = Number(cupom.descontoPorcentagem || 0);
      descontoCalc = (valorSubtotal * pct) / 100.0;
    } else if (["valor_fixo", "fixo"].includes(String(cupom.tipo).toLowerCase())) {
      descontoCalc = Number(cupom.descontofixo || 0);
    } else if (String(cupom.tipo).toLowerCase() === "frete") {
      descontoCalc = 0;
    }

    descontoCalc = Number(descontoCalc.toFixed(2));
    return { valido: true, desconto: descontoCalc };
  };

  const aplicarCupom = (idOrObj) => {
    let cupom = null;
    if (!idOrObj) {
      setCupomSelecionado(null);
      setCupomBusca("");
      setDesconto(0);
      return;
    }
    if (typeof idOrObj === "object") cupom = idOrObj;
    else cupom = cuponsLista.find((c) => String(c.id) === String(idOrObj));

    if (!cupom) {
      const maybe = cuponsLista.find(
        (c) => String(c.nome).toLowerCase() === String(idOrObj).toLowerCase()
      );
      if (maybe) cupom = maybe;
    }

    if (!cupom) {
      setCupomSelecionado(null);
      setCupomBusca("");
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

  // -------------------- PIX: CRIAR PAGAMENTO --------------------
  async function criarPagamentoPix({ total, pedidoId, email }) {
    const resp = await fetch("http://localhost:5000/create_pix_payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(total),
        order_id: String(pedidoId),
        email: email || "cliente@teste.com",
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(
        data?.erro ? JSON.stringify(data.erro) : "Erro ao criar pagamento PIX"
      );
    }

    if (data.ticket_url) {
      window.open(data.ticket_url, "_blank");
    }

    if (data.qr_code_base64) {
      setPixQrBase64(data.qr_code_base64);
      setPixPaymentId(data.payment_id);
      setPixStatus(data.status || "pending");
      setShowPix(true);
    }

    return data;
  }

  // -------------------- SALVAR VENDA --------------------
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

      const retorno = await res.json().catch(() => ({}));
      const pedidoId =
        retorno.id ||
        retorno.pedidoId ||
        retorno.vendaId ||
        retorno.resultado?.id ||
        String(Date.now());

      if (String(formaPagamento).toLowerCase() === "pix") {
        await criarPagamentoPix({
          total: Number((subtotal - desconto).toFixed(2)),
          pedidoId,
          email: "cliente@teste.com",
        });
      }

      for (const item of produtos) {
        const prod = produtosDisponiveis.find(
          (p) => String(p.id) === String(item.id)
        );
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
            const jaAdicionado = produtos.find(
              (p) => String(p.id) === String(produto.id)
            );
            if (jaAdicionado) return alert("Produto já adicionado!");
            setProdutos([
              ...produtos,
              { ...produto, quantidade: produto.quantidade || 1 },
            ]);
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
              <span>
                R$
                {(
                  Number(produto.preco || 0) * Number(produto.quantidade || 0)
                ).toFixed(2)}
              </span>
              <button
                className={styles.trashButton}
                onClick={() => handleRemoverProduto(index)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}

          <div className={styles.totalRow}>
            <span>Total itens</span>
            <span className={styles.valorDireita}>
              R${subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CUPOM E RESUMO */}
        <div className={styles.resumo}>
          <DropdownSelect
            label="Cupom"
            placeholder="Código do cupom..."
            lista={cuponsLista}
            value={cupomBusca}
            selectedId={cupomSelecionado}
            onChange={setCupomBusca}
            onSelect={aplicarCupom}
            onClear={() => aplicarCupom(null)}
          />

          <div className={styles.resumoItem}>
            <span>Desconto</span>
            <span className={styles.valorDireita}>- R${desconto.toFixed(2)}</span>
          </div>

          <div className={styles.resumoItem}>
            <span>Total a pagar</span>
            <span className={styles.totalValue}>
              R${(subtotal - desconto).toFixed(2)}
            </span>
          </div>
        </div>

        {/* ENTREGA */}
        <div className={styles.entregaBox}>
          <label>Entrega</label>
          <select
            className={styles.select}
            value={tipoEntrega}
            onChange={(e) => setTipoEntrega(e.target.value)}
          >
            <option value="entrega">Entrega</option>
            <option value="retirada">Retirada</option>
          </select>

          {tipoEntrega === "entrega" && (
            <input
              className={styles.inputEntrega}
              type="date"
              value={dataEntrega}
              onChange={(e) => setDataEntrega(e.target.value)}
            />
          )}
        </div>

        {/* FORMA DE PAGAMENTO */}
        <div className={styles.entregaBox}>
          <label>Forma de pagamento</label>
          <select
            className={styles.select}
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          >
            <option value="Pix">Pix</option>
            <option value="Cartão">Cartão</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

        {/* BOTÃO CONFIRMAR */}
        <button
          className={styles.confirmarVenda}
          onClick={handleConfirmarVenda}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Confirmar venda"}
        </button>

        {/* ERRO */}
        {errorMsg && (
          <div style={{ color: "red", marginTop: 8 }}>{errorMsg}</div>
        )}
      </div>

      {/* MODAL PIX (fallback quando não há ticket_url) */}
      {showPix && (
        <div className={styles.modalWrapper}>
          <div className={styles.modal}>
            <h3>Pagamento Pix</h3>
            {pixQrBase64 ? (
              <img
                alt="Pague com Pix"
                src={`data:image/png;base64,${pixQrBase64}`}
                style={{
                  width: 300,
                  height: 300,
                  objectFit: "contain",
                  borderRadius: 12,
                }}
              />
            ) : (
              <p>Gerando QR...</p>
            )}
            <p>
              Status: <b>{pixStatus || "pending"}</b>
            </p>
            <button onClick={() => setShowPix(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR CLIENTE */}
      {showCadastrarCliente && (
        <div className={styles.modalWrapper}>
          <div className={styles.modal}>
            <CadastrarCliente onClose={() => setShowCadastrarCliente(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
