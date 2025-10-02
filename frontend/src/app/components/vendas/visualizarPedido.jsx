import styles from "../../styles/visualizarPedido.module.css";

const formatCurrency = (valor) =>
  Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function VisualizarPedido({ onClose, pedido }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Venda #{pedido.idpedido}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            Fechar
          </button>
        </div>

        <div className={styles.infoLinha}>
          <div className={`${styles.infoColuna} ${styles.infoColunaEsquerda}`}>
            <strong>Cliente:</strong>
            <span>{pedido.nomeCliente}</span>
          </div>
          <div className={`${styles.infoColuna} ${styles.infoColunaDireita}`}>
            <strong>Data da compra:</strong>
            <span>{new Date(pedido.dataVenda).toLocaleDateString()}</span>
          </div>
          <div className={`${styles.infoColuna} ${styles.infoColunaDireita}`}>
            <strong>Status:</strong>
            <span>{pedido.status}</span>
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
            {pedido.itensVendidos.map((item, index) => (
              <tr key={index}>
                <td>
                  <span className={styles.itemIcon}></span>
                  {item.nome}
                </td>
                <td>{item.quantidade}</td>
                <td>{formatCurrency(item.valorUnitario)}</td>
                <td>{formatCurrency(item.valorTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className={styles.linhaSeparadora} />

        <div className={styles.section}>
          <div className={styles.totalLinha}>
            <strong>SubTotal:</strong>
            <span>{formatCurrency(pedido.subtotal)}</span>
          </div>
          <div className={styles.totalLinha}>
            <strong>Desconto:</strong>
            <span>{formatCurrency(pedido.desconto)}</span>
          </div>
          <div className={styles.totalDestaque}>
            <strong>Total:</strong>
            <span>{formatCurrency(pedido.valorTotal)}</span>
          </div>
        </div>

        <hr className={styles.linhaSeparadora} />

        <div className={styles.section}>
          <div className={styles.footerLinha}>
            <strong>Forma de pagamento:</strong> {pedido.formaPagamento}
          </div>
          <div className={styles.footerLinha}>
            <strong>Entrega:</strong> {pedido.formaEntrega} -{" "}
            {pedido.localEntrega}
          </div>
          <div className={styles.footerLinha}>
            <strong>Data de Entrega:</strong>{" "}
            {new Date(pedido.dataEntrega).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}