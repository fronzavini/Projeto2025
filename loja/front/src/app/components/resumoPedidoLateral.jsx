// src/components/ResumoPedidoLateral.jsx
"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faReceipt } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/checkout.module.css";

// BACKEND (use .env NEXT_PUBLIC_BACKEND_URL se tiver)
const BACKEND_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://127.0.0.1:5000";

// Item do pedido
const ItemResumo = ({ item }) => {
  return (
    <div className={styles.itemResumo}>
      <div>
        <p className={styles.nomeItemResumo}>{item.nome}</p>
      </div>
      <p className={styles.quantidadeItemResumo}>{item.quantidade}</p>
      <p className={styles.precoItemResumo}>
        R$ {Number(item.preco).toFixed(2).replace(".", ",")}
      </p>
    </div>
  );
};

const parseFreteToNumber = (frete) => {
  if (typeof frete === "string" && frete.toLowerCase().includes("gr")) return 0;
  const n = Number(frete);
  return Number.isFinite(n) ? n : 0;
};

const ResumoPedidoLateral = () => {
  const [dadosCheckout, setDadosCheckout] = useState({
    itensPedido: [],
    enderecoEntrega: {
      nome: "",
      numero: "",
      cep: "",
      cidade: "",
      estado: "",
      destinatario: "",
    },
    valoresTotais: { frete: "Grátis", total: 0 },
  });

  const [desconto, setDesconto] = useState(0);
  const [cupomCodigo, setCupomCodigo] = useState("");

  // mesma assinatura usada no seu código
  const atualizarEndereco = (novo) =>
    setDadosCheckout((prev) => ({ ...prev, enderecoEntrega: { ...novo } }));

  const { itensPedido, enderecoEntrega, valoresTotais } = dadosCheckout;

  // Estados do formulário (mantidos)
  const [novoEndereco, setNovoEndereco] = useState({
    nome: "",
    numero: "",
    cep: "",
    cidade: "",
    estado: "",
    destinatario: "",
  });
  const [mostraFormulario, setMostraFormulario] = useState(false);

  const handleChange = (e) => {
    setNovoEndereco({ ...novoEndereco, [e.target.name]: e.target.value });
  };

  const handleSalvarEndereco = (e) => {
    e.preventDefault();
    if (!novoEndereco.nome || !novoEndereco.cep) {
      alert("Preencha os campos obrigatórios!");
      return;
    }
    atualizarEndereco(novoEndereco);
    setMostraFormulario(false);
  };

  // Carrega carrinho e aplica cupom (se existir em localStorage)
  useEffect(() => {
    (async () => {
      try {
        const userData =
          typeof window !== "undefined"
            ? localStorage.getItem("usuario_loja")
            : null;
        const idUsuario =
          (userData && JSON.parse(userData)?.id) ||
          (typeof window !== "undefined"
            ? Number(localStorage.getItem("idUsuario"))
            : null);

        if (!idUsuario) return;

        // 1) carrinho
        const res = await fetch(
          `${BACKEND_URL}/carrinho/usuario/${idUsuario}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) {
          setDadosCheckout((prev) => ({
            ...prev,
            itensPedido: [],
            valoresTotais: { ...prev.valoresTotais, total: 0 },
          }));
          setDesconto(0);
          return;
        }

        const carrinho = await res.json();
        const produtos = Array.isArray(carrinho?.produtos)
          ? carrinho.produtos
          : [];
        const subtotal = Number(carrinho?.valorTotal || 0);
        const frete = "Grátis";
        const freteNum = parseFreteToNumber(frete);

        // 2) enriquecer itens com nome/preço atual
        const itensComNome = await Promise.all(
          produtos.map(async (p) => {
            try {
              const pr = await fetch(
                `${BACKEND_URL}/produto_id/${p.produto_id}`,
                {
                  cache: "no-store",
                }
              );
              const prod = pr.ok ? await pr.json() : null;
              return {
                id: p.produto_id,
                nome: prod?.nome || `Produto #${p.produto_id}`,
                quantidade: Number(p.quantidade || 0),
                preco: Number(p.preco_unitario || prod?.preco || 0),
              };
            } catch {
              return {
                id: p.produto_id,
                nome: `Produto #${p.produto_id}`,
                quantidade: Number(p.quantidade || 0),
                preco: Number(p.preco_unitario || 0),
              };
            }
          })
        );

        // 3) aplica cupom, se houver no localStorage
        let total = Math.max(0.01, subtotal + freteNum);
        let descAbs = 0;

        let codigo = "";
        try {
          codigo =
            (typeof window !== "undefined" &&
              (localStorage.getItem("cupom_aplicado") || "")) ||
            "";
        } catch {}
        const codigoUpper = (codigo || "").trim().toUpperCase();

        if (codigoUpper && subtotal > 0) {
          try {
            const resp = await fetch(`${BACKEND_URL}/calcular_desconto`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                valor_total: subtotal,
                codigo_cupom: codigoUpper,
              }),
            });
            const data = await resp.json().catch(() => null);
            if (resp.ok && data?.resultado === "ok") {
              // usa valores do backend
              const backendDesconto = Number(data.desconto || 0);
              const backendFinal = Number(data.valor_final || subtotal);
              descAbs = Math.min(backendDesconto, subtotal);
              total = Math.max(0.01, backendFinal + freteNum);
              setCupomCodigo(codigoUpper);
            } else {
              // cupom inválido: ignora
              setCupomCodigo("");
            }
          } catch {
            setCupomCodigo("");
          }
        } else {
          setCupomCodigo("");
        }

        setDesconto(descAbs);
        setDadosCheckout((prev) => ({
          ...prev,
          itensPedido: itensComNome,
          valoresTotais: {
            ...prev.valoresTotais,
            frete,
            total,
          },
        }));
      } catch (e) {
        console.error("Erro ao carregar resumo do pedido:", e);
      }
    })();
  }, []);

  return (
    <div className={styles.containerResumoLateral}>
      {/* 1. Cabeçalho e Endereço */}
      <div className={styles.cabecalhoLateral}>
        <h4>Endereço e resumo do pedido</h4>
      </div>

      <div className={styles.secaoEnderecoLateral}>
        <div className={styles.iconeTitulo}>
          <FontAwesomeIcon icon={faHouse} className={styles.iconeCasa} />
          <h5 className={styles.tituloSecao}>Endereço de entrega</h5>
        </div>

        {enderecoEntrega && enderecoEntrega.nome && !mostraFormulario ? (
          <div className={styles.detalhesEnderecoLateral}>
            <p className={styles.nomeEnderecoLateral}>
              <input type="radio" checked readOnly className={styles.radio} />
              <strong>{enderecoEntrega.nome}</strong>, {enderecoEntrega.numero}
            </p>
            <p className={styles.linhaEndereco}>
              Casa - CEP {enderecoEntrega.cep} - {enderecoEntrega.cidade} -{" "}
              {enderecoEntrega.estado}
            </p>
            <p className={styles.linhaEndereco}>
              Principal - {enderecoEntrega.destinatario}
            </p>
          </div>
        ) : null}

        {mostraFormulario && (
          <form
            className={styles.formNovoEndereco}
            onSubmit={handleSalvarEndereco}
          >
            <input
              type="text"
              name="nome"
              placeholder="Nome do endereço"
              value={novoEndereco.nome}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="numero"
              placeholder="Número"
              value={novoEndereco.numero}
              onChange={handleChange}
            />
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              value={novoEndereco.cep}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cidade"
              placeholder="Cidade"
              value={novoEndereco.cidade}
              onChange={handleChange}
            />
            <input
              type="text"
              name="estado"
              placeholder="Estado"
              value={novoEndereco.estado}
              onChange={handleChange}
            />
            <input
              type="text"
              name="destinatario"
              placeholder="Destinatário"
              value={novoEndereco.destinatario}
              onChange={handleChange}
            />
            <button type="submit" className={styles.botaoSalvarEndereco}>
              Salvar Endereço
            </button>
          </form>
        )}

        <p className={styles.textoMudarEndereco}>
          Quer receber seu pedido em outro endereço?
        </p>
        <button
          className={styles.botaoUsarOutroEndereco}
          onClick={() => setMostraFormulario(!mostraFormulario)}
        >
          {mostraFormulario ? "Cancelar" : "USAR OUTRO ENDEREÇO"}
        </button>
      </div>

      {/* 2. Resumo do Pedido */}
      <div className={styles.secaoResumoDetalhado}>
        <div className={styles.iconeTitulo}>
          <FontAwesomeIcon icon={faReceipt} className={styles.iconeRecibo} />
          <h5 className={styles.tituloSecao}>Resumo do pedido</h5>
        </div>

        <div className={styles.listaItensResumo}>
          <div className={styles.cabecalhoItensResumo}>
            <p>Itens do Pedido</p>
            <p>Qtde</p>
            <p>Preço</p>
          </div>
          {itensPedido && itensPedido.length > 0 ? (
            itensPedido.map((item) => <ItemResumo key={item.id} item={item} />)
          ) : (
            <p>Seu carrinho está vazio.</p>
          )}
        </div>

        {/* Totais */}
        <div className={styles.linhaTotal}>
          <p className={styles.rotuloTotal}>Frete</p>
          <p className={styles.valorFrete}>{valoresTotais.frete}</p>
        </div>

        {/* Desconto (mostra somente quando houver) */}
        {desconto > 0 && (
          <div className={styles.linhaTotal}>
            <p className={styles.rotuloTotal}>
              Desconto{cupomCodigo ? ` (${cupomCodigo})` : ""}
            </p>
            <p className={styles.montanteTotal}>
              - R$ {desconto.toFixed(2).replace(".", ",")}
            </p>
          </div>
        )}

        <div className={styles.linhaTotal}>
          <p className={styles.rotuloTotal}>Valor total</p>
          <p className={styles.montanteTotal}>
            R${" "}
            {Number(valoresTotais.total || 0)
              .toFixed(2)
              .replace(".", ",")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumoPedidoLateral;
