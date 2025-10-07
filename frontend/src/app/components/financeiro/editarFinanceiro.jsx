"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarFinanceiro({ transacao, onClose, onSuccess }) {
  const [form, setForm] = useState({ ...transacao });

  useEffect(() => {
    if (transacao) {
      setForm({
        data: transacao.data || "",
        descricao: transacao.descricao || "",
        categoria: transacao.categoria || "",
        subcategoria: transacao.subcategoria || "",
        origem: transacao.origem || "",
        valor: transacao.valor?.toString() || "",
        formaPagamento: transacao.formaPagamento || "",
        status: transacao.status || "",
      });
    }
  }, [transacao]);

  const opcoesCategoria = [
    { label: "Receita", value: "Receita" },
    { label: "Despesa", value: "Despesa" },
    { label: "Investimento", value: "Investimento" },
  ];

  const opcoesSubcategoria = [
    {
      label: "Venda Loja Física",
      value: "Venda Loja Física",
      categoria: "Receita",
    },
    { label: "Venda Online", value: "Venda Online", categoria: "Receita" },
    {
      label: "Serviço de Montagem / Decoração",
      value: "Serviço de Montagem / Decoração",
      categoria: "Receita",
    },
    { label: "Aluguel", value: "Aluguel", categoria: "Despesa" },
    {
      label: "Compra de Mercadorias / Insumos",
      value: "Compra de Mercadorias / Insumos",
      categoria: "Despesa",
    },
    {
      label: "Marketing e Divulgação",
      value: "Marketing e Divulgação",
      categoria: "Despesa",
    },
    {
      label: "Compra de Equipamentos",
      value: "Compra de Equipamentos",
      categoria: "Investimento",
    },
    {
      label: "Reformas e Melhorias",
      value: "Reformas e Melhorias",
      categoria: "Investimento",
    },
  ];

  const opcoesFormaPagamento = [
    { label: "Pix", value: "Pix" },
    { label: "Cartão de Crédito", value: "Cartão de Crédito" },
    { label: "Cartão de Débito", value: "Cartão de Débito" },
    { label: "Dinheiro", value: "Dinheiro" },
    { label: "Boleto", value: "Boleto" },
    { label: "Transferência Bancária", value: "Transferência Bancária" },
  ];

  const opcoesStatus = [
    { label: "Pendente", value: "Pendente" },
    { label: "Recebido", value: "Recebido" },
    { label: "Pago", value: "Pago" },
    { label: "Cancelado", value: "Cancelado" },
  ];

  const subcategoriasFiltradas = form.categoria
    ? opcoesSubcategoria.filter((sub) => sub.categoria === form.categoria)
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        `http://localhost:5000/editar_transacaofinanceira/${transacao.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!resp.ok) throw new Error();
      alert("Transação atualizada com sucesso!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch {
      alert("Erro ao editar transação.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Editar Movimentação</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="data" className={styles.label}>
                Data
              </label>
              <input
                className={styles.input}
                type="date"
                id="data"
                name="data"
                value={form.data}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descricao" className={styles.label}>
                Descrição
              </label>
              <input
                className={styles.input}
                type="text"
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="categoria" className={styles.label}>
                  Categoria
                </label>
                <select
                  className={styles.select}
                  id="categoria"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {opcoesCategoria.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subcategoria" className={styles.label}>
                  Subcategoria
                </label>
                <select
                  className={styles.select}
                  id="subcategoria"
                  name="subcategoria"
                  value={form.subcategoria}
                  onChange={handleChange}
                  disabled={!form.categoria}
                  required
                >
                  <option value="">Selecione a subcategoria</option>
                  {subcategoriasFiltradas.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="origem" className={styles.label}>
                Origem
              </label>
              <input
                className={styles.input}
                type="text"
                id="origem"
                name="origem"
                value={form.origem}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="valor" className={styles.label}>
                Valor
              </label>
              <input
                className={styles.input}
                type="number"
                step="0.01"
                min="0"
                id="valor"
                name="valor"
                value={form.valor}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="formaPagamento" className={styles.label}>
                  Forma de Pagamento
                </label>
                <select
                  className={styles.select}
                  id="formaPagamento"
                  name="formaPagamento"
                  value={form.formaPagamento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione forma de pagamento</option>
                  {opcoesFormaPagamento.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status" className={styles.label}>
                  Status
                </label>
                <select
                  className={styles.select}
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione status</option>
                  {opcoesStatus.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className={styles.botaoEnviar}>
              Salvar alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}