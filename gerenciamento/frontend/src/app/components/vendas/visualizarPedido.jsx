"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/visualizarPedido.module.css";

const formatCurrency = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (d) => {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString("pt-BR");
};

export default function VisualizarPedido({ onClose, pedido }) {
  // pedido aqui é a VENDA selecionada na tabela. Ela deve ter o campo `pedido` (id do pedido)
  const [pedidoDetalhado, setPedidoDetalhado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Carrega informações do pedido completo (tabela pedidos)
  useEffect(() => {
    setErro("");
    if (!pedido?.pedido) {
      // Sem id do pedido vinculado: apenas mostra dados existentes da venda
      setPedidoDetalhado(null);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5000/pedidos/${pedido.pedido}`)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || "Falha ao carregar pedido");
        }
        return res.json();
      })
      .then((data) => setPedidoDetalhado(data))
      .catch((err) => {
        console.error("Erro ao carregar detalhes do pedido:", err);
        setErro("Não foi possível carregar os detalhes do pedido.");
      })
      .finally(() => setLoading(false));
  }, [pedido]);

  // Fonte de verdade para render: prioriza os dados do pedido detalhado; senão, usa a venda recebida
  const p = useMemo(
    () => pedidoDetalhado || pedido || {},
    [pedidoDetalhado, pedido]
  );

  // Monta itens vendidos
  const itens = useMemo(() => {
    // Caso o endpoint /pedidos/<id> já traga `itensVendidos`, usa direto
    if (Array.isArray(p.itensVendidos) && p.itensVendidos.length) {
      return p.itensVendidos.map((i) => ({
        nome: i.nome ?? `Produto ${i.id ?? ""}`.trim(),
        quantidade: Number(i.quantidade || 0),
        valorUnitario: Number(i.valorUnitario || i.preco || 0),
        valorTotal:
          Number(i.valorTotal) ||
          Number(i.valorUnitario || i.preco || 0) * Number(i.quantidade || 0),
      }));
    }

    // Caso venha a string JSON de produtos da venda
    if (p.produtos) {
      try {
        const arr =
          typeof p.produtos === "string" ? JSON.parse(p.produtos) : p.produtos;
        if (Array.isArray(arr)) {
          return arr.map((i) => ({
            nome: i.nome ?? `Produto ${i.id ?? ""}`.trim(),
            quantidade: Number(i.quantidade || 0),
            valorUnitario: Number(i.preco || i.valorUnitario || 0),
            valorTotal:
              Number(i.valorTotal) ||
              Number(i.preco || i.valorUnitario || 0) *
                Number(i.quantidade || 0),
          }));
        }
      } catch {
        /* ignore parse error */
      }
    }
    return [];
  }, [p]);

  const tituloVenda = p.id ?? pedido?.id ?? (p.id_venda || p.idVenda) ?? "—";

  const tituloPedido = p.pedido ?? p.id ?? pedido?.pedido ?? "—";

  const totalMostrar =
    p.valorTotal ??
    p.valor_total ??
    itens.reduce((acc, it) => acc + (it.valorTotal || 0), 0);

  const statusPago = Number(p.pago || 0) ? "Pago" : "Não pago";

  const formaPg = p.forma_pagamento || p.formaPagamento || "-";

  const tipoEntrega = p.tipo_entrega || p.formaEntrega || "-";

  const dataEntrega = p.data_entrega || p.dataEntrega || null;

  // Monta endereço de entrega (se houver)
  const enderecoEntrega = [
    p.entrega_logradouro,
    p.entrega_numero,
    p.entrega_bairro,
    p.entrega_municipio,
    p.entrega_uf,
    p.entrega_cep ? `CEP ${p.entrega_cep}` : "",
    p.entrega_complemento,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Venda #{tituloVenda}
              {tituloPedido !== "—" && (
                <span className={styles.subtitle}>
                  {" "}
                  &nbsp;|&nbsp; Pedido #{tituloPedido}
                </span>
              )}
            </h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            Fechar
          </button>
        </div>

        {loading && <p>Carregando detalhes...</p>}
        {!loading && erro && (
          <p style={{ color: "var(--danger, #b00020)" }}>{erro}</p>
        )}

        {!loading && (
          <>
            <div className={styles.infoLinha}>
              <div
                className={`${styles.infoColuna} ${styles.infoColunaEsquerda}`}
              >
                <strong>Cliente:</strong>
                <span>{p.nomeCliente || p.cliente || "N/D"}</span>
              </div>
              <div
                className={`${styles.infoColuna} ${styles.infoColunaDireita}`}
              >
                <strong>Data da compra:</strong>
                <span>{formatDate(p.dataVenda || p.data_pedido)}</span>
              </div>
              <div
                className={`${styles.infoColuna} ${styles.infoColunaDireita}`}
              >
                <strong>Status:</strong>
                <span>{statusPago}</span>
              </div>
            </div>

            <hr className={styles.linhaSeparadora} />

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quant.</th>
                  <th>Valor Unit.</th>
                  <th>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {itens.length ? (
                  itens.map((item, i) => (
                    <tr key={i}>
                      <td>{item.nome}</td>
                      <td>{item.quantidade}</td>
                      <td>{formatCurrency(item.valorUnitario)}</td>
                      <td>{formatCurrency(item.valorTotal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", opacity: 0.7 }}
                    >
                      Nenhum item encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <hr className={styles.linhaSeparadora} />

            <div className={styles.section}>
              <div className={styles.totalLinha}>
                <strong>Total:</strong>
                <span>{formatCurrency(totalMostrar)}</span>
              </div>
            </div>

            <hr className={styles.linhaSeparadora} />

            <div className={styles.section}>
              <div className={styles.footerLinha}>
                <strong>Forma de pagamento:</strong> {formaPg || "N/D"}
              </div>
              <div className={styles.footerLinha}>
                <strong>Tipo de entrega:</strong> {tipoEntrega || "N/D"}
              </div>
              {dataEntrega && (
                <div className={styles.footerLinha}>
                  <strong>Data de Entrega:</strong> {formatDate(dataEntrega)}
                </div>
              )}
              {enderecoEntrega && (
                <div className={styles.footerLinha}>
                  <strong>Endereço de entrega:</strong> {enderecoEntrega}
                </div>
              )}
              {(p.mp_status || p.mp_payment_id) && (
                <div className={styles.footerLinha} style={{ opacity: 0.8 }}>
                  <strong>MP:</strong>{" "}
                  {[
                    p.mp_status ? `status=${p.mp_status}` : null,
                    p.mp_payment_id ? `id=${p.mp_payment_id}` : null,
                  ]
                    .filter(Boolean)
                    .join(" | ")}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
