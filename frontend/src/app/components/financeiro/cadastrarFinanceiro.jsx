import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarFinanceiro({ onClose }) {
  const [form, setForm] = useState({
    data: "",
    descricao: "",
    categoria: "",
    subcategoria: "",
    origem: "",
    valor: "",
    formaPagamento: "",
    status: "",
  });

  const opcoesCategoria = [
    { label: "Receita", value: "Receita" },
    { label: "Despesa", value: "Despesa" },
    { label: "Investimento", value: "Investimento" },
  ];

  const opcoesSubcategoria = [
    // Receita
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
    // Despesa
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
    // Investimento
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

  // Filtra subcategorias conforme categoria selecionada
  const subcategoriasFiltradas = form.categoria
    ? opcoesSubcategoria.filter((sub) => sub.categoria === form.categoria)
    : [];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dadosParaEnviar = {
      ...form,
      valor: parseFloat(form.valor.replace(",", ".")),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/incluir_movimentacao",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        }
      );

      if (!response.ok) throw new Error("Erro ao cadastrar movimentação.");

      alert("Movimentação cadastrada com sucesso!");
      onClose();

      setForm({
        data: "",
        descricao: "",
        categoria: "",
        subcategoria: "",
        origem: "",
        valor: "",
        formaPagamento: "",
        status: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar movimentação.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Nova movimentação</h2>
        <button
          className={styles.botaoCancelar}
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="data" className={styles.label}>
            Data
          </label>
          <input
            type="date"
            id="data"
            name="data"
            className={styles.input}
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
            type="text"
            id="descricao"
            name="descricao"
            className={styles.input}
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
              id="categoria"
              name="categoria"
              className={styles.input}
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
              id="subcategoria"
              name="subcategoria"
              className={styles.input}
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
            type="text"
            id="origem"
            name="origem"
            className={styles.input}
            value={form.origem}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="valor" className={styles.label}>
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            id="valor"
            name="valor"
            className={styles.input}
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
              id="formaPagamento"
              name="formaPagamento"
              className={styles.input}
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
              id="status"
              name="status"
              className={styles.input}
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
          Cadastrar movimentação
        </button>
      </form>
    </div>
  );
}
