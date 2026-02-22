import React from "react";
import styles from "../../styles/cadastrarCliente.module.css";

/**
 * Componente para visualizar os detalhes de um produto.
 * @param {object} props
 * @param {function} props.onClose - Função para fechar o modal
 * @param {object} props.produto - Produto a ser visualizado
 */
export default function VisualizarProduto({ onClose, produto }) {
  const precoFormatado = produto.preco
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.preco)
    : "R$ 0,00";

  const status = produto.estado ? "Ativo" : "Inativo";

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Produto: {produto.nome}</h2>
            <button className={styles.botaoCancelar} type="button" onClick={onClose}>
              Fechar
            </button>
          </div>

          {/* Exibição de imagens */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
            {produto.imagens && produto.imagens.length > 0 ? (
              produto.imagens.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${produto.nome} ${idx + 1}`}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                />
              ))
            ) : (
              <span>Sem imagens disponíveis</span>
            )}
          </div>

          <form>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>ID</label>
                <input className={styles.input} type="text" value={produto.id} disabled />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Marca / Tipo</label>
                <input className={styles.input} type="text" value={produto.marca} disabled />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Categoria</label>
                <input className={styles.input} type="text" value={produto.categoria} disabled />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Preço</label>
                <input className={styles.input} type="text" value={precoFormatado} disabled />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Quantidade em Estoque</label>
                <input className={styles.input} type="number" value={produto.quantidade_estoque} disabled />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Estoque Mínimo</label>
                <input className={styles.input} type="number" value={produto.estoque_minimo} disabled />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <input className={styles.input} type="text" value={status} disabled />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Fornecedor ID</label>
              <input className={styles.input} type="text" value={produto.fornecedor_id || ""} disabled />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
