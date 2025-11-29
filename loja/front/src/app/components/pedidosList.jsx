// components/PedidosList.js
"use client";
import styles from "../styles/perfil.module.css";

export default function PedidosList({ pedidos }) {
  return (
    <div className={styles.pedidosList}>
      <h2>Meus Pedidos</h2>
      {pedidos.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido.id} className={styles.pedidoItem}>
            <div>
              <strong>Pedido #{pedido.id}</strong> - {pedido.status}
            </div>
            <div>Data: {pedido.data}</div>
            <div>Valor: R$ {pedido.valor.toFixed(2).replace(".", ",")}</div>
            <button onClick={() => alert("Detalhes do pedido: " + pedido.id)}>
              Ver detalhes
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
