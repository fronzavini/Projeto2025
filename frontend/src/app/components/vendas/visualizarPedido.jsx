  "use client";
const formatCurrency = (valor) =>
  Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

import styles from "../../styles/visualizarPedido.module.css";

export default function VisualizarPedido({ onClose, pedido }) {
  if (!pedido) return null;
  return (
    <div className={styles.modal}>
      <div className={styles.formulario}>
        <h2>Detalhes da Venda</h2>
        <p><b>ID:</b> {pedido.id}</p>
        <p><b>Cliente:</b> {pedido.cliente}</p>
        <p><b>Funcionário:</b> {pedido.funcionario}</p>
        <p><b>Data da Venda:</b> {pedido.dataVenda}</p>
        <p><b>Valor Total:</b> {formatCurrency(pedido.valorTotal)}</p>
        <h3>Produtos</h3>
        <ul>
          {(pedido.produtos || []).map((p, i) => (
            <li key={i}>
              {p.nome} - {p.quantidade} x {formatCurrency(p.valorUnit)}
            </li>
          ))}
        </ul>
        <div className={styles.botoes}>
          <button type="button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}