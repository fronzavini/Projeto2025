// src/components/PrincipalCheckout.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/checkout.module.css";

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://192.168.18.155:5000";

/* ================= Utils ================= */
function normalizePrice(v) {
  if (v == null) return 0;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  let s = String(v).trim();
  if (s.includes(",") && !s.includes(".")) {
    s = s.replace(/\./g, "");
    s = s.replace(",", ".");
  } else {
    s = s.replace(/,/g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function toYMD(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getUser() {
  try {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem("usuario_loja")
        : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function getUserId() {
  const obj = getUser();
  try {
    return (
      obj?.id ||
      (typeof window !== "undefined"
        ? Number(localStorage.getItem("idUsuario"))
        : null)
    );
  } catch {
    return null;
  }
}

function getCupomFromStorage() {
  try {
    return (
      (typeof window !== "undefined" &&
        (localStorage.getItem("cupom_aplicado") || "")) ||
      ""
    )
      .trim()
      .toUpperCase();
  } catch {
    return "";
  }
}

/* ============== Componente ============== */
const PrincipalCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // dados vindos do backend
  const [itens, setItens] = useState([]); // [{id, nome, imagem, quantidade, preco}]
  const [valoresTotais, setValoresTotais] = useState({
    subtotal: 0,
    total: 0,
    frete: "Grátis",
  });
  const [desconto, setDesconto] = useState(0);
  const [cupom, setCupom] = useState("");

  // carrega carrinho + detalhes dos produtos + aplica cupom (se houver)
  useEffect(() => {
    (async () => {
      setErro(null);
      try {
        const userId = getUserId();
        if (!userId) {
          setErro("Você precisa estar logado para finalizar o pedido.");
          return;
        }

        // 1) carregar carrinho do usuário
        const resCarrinho = await fetch(`${BASE}/carrinho/usuario/${userId}`, {
          cache: "no-store",
        });
        if (!resCarrinho.ok) {
          setErro("Não foi possível carregar seu carrinho.");
          return;
        }
        const carrinho = await resCarrinho.json();
        const itensBrutos = Array.isArray(carrinho?.produtos)
          ? carrinho.produtos
          : [];

        // 2) enriquecer com nome/imagens do produto
        const itensEnriquecidos = await Promise.all(
          itensBrutos.map(async (p) => {
            try {
              const r = await fetch(`${BASE}/produto_id/${p.produto_id}`, {
                cache: "no-store",
              });
              const prod = r.ok ? await r.json() : null;
              return {
                id: p.produto_id,
                nome: prod?.nome || `Produto #${p.produto_id}`,
                imagem: prod?.imagem_1 || prod?.imagem || "/placeholder.png",
                quantidade: Number(p.quantidade || 0),
                preco: Number(
                  p.preco_unitario != null ? p.preco_unitario : prod?.preco || 0
                ),
                vendidoPor: "Loja",
                enviadoPor: "Loja",
                cor: "Padrão",
                tamanho: "Único",
              };
            } catch {
              return {
                id: p.produto_id,
                nome: `Produto #${p.produto_id}`,
                imagem: "/placeholder.png",
                quantidade: Number(p.quantidade || 0),
                preco: Number(p.preco_unitario || 0),
                vendidoPor: "Loja",
                enviadoPor: "Loja",
                cor: "Padrão",
                tamanho: "Único",
              };
            }
          })
        );

        const subtotal = itensEnriquecidos.reduce(
          (acc, it) => acc + Number(it.preco || 0) * Number(it.quantidade || 0),
          0
        );

        // 3) aplica cupom salvo (se houver)
        const freteNum = 0; // "Grátis"
        const codigo = getCupomFromStorage();
        let total = Math.max(0.01, subtotal + freteNum);
        let descAbs = 0;

        if (codigo && subtotal > 0) {
          try {
            const resp = await fetch(`${BASE}/calcular_desconto`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                valor_total: subtotal,
                codigo_cupom: codigo,
              }),
            });
            const data = await resp.json().catch(() => null);
            if (resp.ok && data?.resultado === "ok") {
              // usa os números do backend
              const backendDesconto = Number(data.desconto || 0);
              const backendFinal = Number(data.valor_final || subtotal);
              descAbs = Math.min(backendDesconto, subtotal);
              total = Math.max(0.01, backendFinal + freteNum);
              setCupom(codigo);
            } else {
              setCupom("");
            }
          } catch {
            setCupom("");
          }
        } else {
          setCupom("");
        }

        setItens(itensEnriquecidos);
        setDesconto(descAbs);
        setValoresTotais({ subtotal, total, frete: "Grátis" });
      } catch (e) {
        console.error(e);
        setErro("Falha ao carregar dados do checkout.");
      }
    })();
  }, []);

  // primeiro item pra UI
  const item = useMemo(() => itens?.[0] || {}, [itens]);

  /* ============== Fluxo Finalizar (criar venda -> criar PIX) ============== */
  const handleFinalizar = async () => {
    setErro(null);

    const user = getUser();
    const email = user?.email || "cliente@teste.com";
    const clienteId = user?.cliente_id;
    const funcionarioId =
      Number(
        (typeof window !== "undefined" &&
          localStorage.getItem("funcionario_id")) ||
          1
      ) || 1;

    // ✅ usa o total já com desconto aplicado
    const total = normalizePrice(valoresTotais?.total || 0);
    if (!total || total <= 0) {
      setErro("Valor total inválido para pagamento.");
      return;
    }
    if (!clienteId) {
      setErro("Não foi possível identificar o cliente para criar a venda.");
      return;
    }
    if (!itens.length) {
      setErro("Seu carrinho está vazio.");
      return;
    }

    try {
      setLoading(true);

      // datas no formato YYYY-MM-DD
      const hoje = toYMD(new Date());
      const dtEntrega = toYMD(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

      // 1) cria VENDA/PEDIDO (valorTotal já com desconto)
      const vendaPayload = {
        cliente: Number(clienteId),
        funcionario: Number(funcionarioId),
        produtos: itens.map((it) => ({
          id: Number(it.id),
          quantidade: Number(it.quantidade),
        })),
        valorTotal: Number(total), // ✅ total final (com desconto)
        formaPagamento: "Pix",
        entrega: 1,
        dataEntrega: dtEntrega,
        dataVenda: hoje,
        // entregaEndereco: {...} // opcional
      };

      const rVenda = await fetch(`${BASE}/criar_venda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendaPayload),
      });

      const vendaData = await rVenda.json().catch(() => null);
      if (!rVenda.ok || !vendaData?.ok) {
        setErro(
          vendaData?.detalhe ||
            vendaData?.erro ||
            vendaData?.detalhes ||
            "Falha ao criar a venda."
        );
        setLoading(false);
        return;
      }

      const pedidoId = vendaData.id_pedido;
      if (!pedidoId) {
        setErro("Venda criada, mas não veio o ID do pedido.");
        setLoading(false);
        return;
      }

      // 2) cria PIX com o mesmo total final
      const rPix = await fetch(`${BASE}/create_pix_payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: String(pedidoId),
          amount: Number(total), // ✅ total final (com desconto)
          email,
        }),
      });

      const data = await rPix.json().catch(() => null);

      if (!rPix.ok || !data?.ok) {
        const msg =
          data?.detalhe?.message ||
          data?.detalhe?.cause?.[0]?.description ||
          data?.erro ||
          "Falha ao criar pagamento PIX.";
        setErro(msg);
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "pix_payment",
          JSON.stringify({
            payment_id: data.payment_id,
            status: data.status,
            external_reference: data.external_reference,
            amount: total,
            pedido_id: pedidoId,
            cupom_aplicado: cupom || null,
            desconto_aplicado: desconto || 0,
          })
        );
      }

      if (data.ticket_url) {
        window.open(data.ticket_url, "_blank", "noopener,noreferrer");
      } else if (data.qr_code_base64) {
        const w = window.open();
        if (w) {
          w.document.write(
            `<img src="data:image/png;base64,${data.qr_code_base64}" style="max-width:100%"/>`
          );
        }
      } else {
        setErro("Pagamento criado, mas não veio o link/QR do PIX.");
      }
    } catch (e) {
      console.error(e);
      setErro("Erro ao processar o pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  /* ============== UI ============== */
  return (
    <div className={styles.containerPrincipal}>
      {/* 1. Seleção do Tipo de Entrega */}
      <div className={styles.secaoEntrega}>
        <h3 className={styles.tituloSecaoPrincipal}>
          Selecione o tipo de entrega
        </h3>

        <div className={styles.detalhesItemEntrega}>
          <div className={styles.vendedor}>
            Vendido por <strong>{item.vendidoPor || "Loja"}</strong> e Enviado
            por <strong>{item.enviadoPor || "Loja"}</strong>
          </div>

          <div className={styles.infoProdutoFrete}>
            <div className={styles.blocoImagem}>
              <img
                src={item.imagem || "/placeholder.png"}
                alt={item.nome || "Produto"}
              />
            </div>

            <div className={styles.detalhesProduto}>
              <p className={styles.nomeProduto}>{item.nome || "Produto"}</p>
              <p>
                Cor: <strong>{item.cor || "Padrão"}</strong>
              </p>
              <p>
                Tamanho: <strong>{item.tamanho || "Único"}</strong>
              </p>
            </div>

            <div className={styles.opcoesFrete}>
              <div className={styles.opcaoFrete}>
                <input type="radio" name="frete" defaultChecked />
                <span className={styles.rotuloFreteNormal}>Normal:</span>
                <span className={styles.valorFreteGratis}>Grátis</span>
                <span className={styles.dataEntrega}>Chega em até 7 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pagamento com Pix */}
      <div className={styles.secaoPagamento}>
        <h3 className={styles.tituloPagamento}>
          <FontAwesomeIcon
            icon={faMoneyBillTransfer}
            className={styles.iconePix}
          />{" "}
          Pagar com Pix
        </h3>

        {/* valor já considera desconto + frete */}
        <p className={styles.valorPagamento}>
          R{"$ "}
          {Number(normalizePrice(valoresTotais?.total || 0))
            .toFixed(2)
            .replace(".", ",")}
        </p>

        {/* badge de cupom aplicado */}
        {cupom && (
          <p className={styles.cupomInfo}>
            Cupom aplicado: <strong>{cupom}</strong>{" "}
            {desconto > 0 && `(− R$ ${desconto.toFixed(2).replace(".", ",")})`}
          </p>
        )}

        <button
          className={styles.botaoFinalizar}
          onClick={handleFinalizar}
          disabled={loading}
          title={loading ? "Gerando PIX..." : "Finalizar pedido"}
        >
          {loading ? "GERANDO PIX..." : "FINALIZAR PEDIDO"}
        </button>

        {erro && <p className={styles.mensagemErro}>{erro}</p>}
      </div>
    </div>
  );
};

export default PrincipalCheckout;
