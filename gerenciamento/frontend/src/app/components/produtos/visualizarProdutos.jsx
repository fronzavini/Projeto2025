import React from "react";
// O estilo pode ser reutilizado ou adaptado, dependendo da sua estrutura de arquivos.
// Estou assumindo que 'cadastrarCliente.module.css' tem estilos genéricos para overlay, popup, form, etc.
import styles from "../../styles/cadastrarCliente.module.css"; 

/**
 * Componente para visualizar os detalhes de um produto.
 * @param {object} props - As propriedades do componente.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {object} props.produto - O objeto do produto a ser visualizado.
 */
export default function VisualizarProduto({ onClose, produto }) {
  // Você pode usar o console.log para inspecionar os dados do produto ao abrir o modal.
  // console.log(produto);

  // Formatação simples do preço para Reais (BRL)
  const precoFormatado = produto.preco ? 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(produto.preco) : 'R$ 0,00';

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            {/* Exibe o ID do produto no título */}
            <h2 className={styles.headerTitle}>Produto: {produto.id}</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <form>
            {/* Campo Nome do Produto */}
            <div className={styles.formGroup}>
              <label htmlFor="nome" className={styles.label}>
                Nome do produto
              </label>
              <input
                className={styles.input}
                id="nome"
                name="nome"
                type="text"
                value={produto.nome || ""}
                disabled // Todos os campos são desabilitados para visualização
              />
            </div>

            <div className={styles.row}>
              {/* Campo Preço */}
              <div className={styles.formGroup}>
                <label htmlFor="preco" className={styles.label}>
                  Preço
                </label>
                <input
                  className={styles.input}
                  id="preco"
                  name="preco"
                  type="text" // Mantém como texto para exibir o preço formatado
                  value={precoFormatado}
                  disabled
                />
              </div>
              
              {/* Campo Quantidade em Estoque */}
              <div className={styles.formGroup}>
                <label htmlFor="quantidadeEstoque" className={styles.label}>
                  Qtd. em Estoque
                </label>
                <input
                  className={styles.input}
                  id="quantidadeEstoque"
                  name="quantidadeEstoque"
                  type="number" 
                  value={produto.quantidadeEstoque || 0}
                  disabled
                />
              </div>
            </div>

            {/* Campo Categoria (exemplo com select desabilitado) */}
            <div className={styles.formGroup}>
              <label htmlFor="categoria" className={styles.label}>
                Categoria
              </label>
              <input
                className={styles.input}
                id="categoria"
                name="categoria"
                type="text"
                value={produto.categoria || ""}
                disabled 
              />
            </div>

            {/* Campo Descrição */}
            <div className={styles.formGroup}>
              <label htmlFor="descricao" className={styles.label}>
                Descrição
              </label>
              <textarea
                className={styles.input} // Pode adaptar para um estilo de textarea
                id="descricao"
                name="descricao"
                rows="4"
                value={produto.descricao || ""}
                disabled
              />
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
