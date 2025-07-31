import { useState, useEffect } from "react";
import styles from "../styles/CadastrarCliente.module.css";

type Opcao = {
  label: string;
  value: string;
};

type OpcaoComCategoria = Opcao & {
  categoria: string;
};

type EditarFinanceiroProps = {
  onClose: () => void;
  registro: {
    data: string;
    descricao: string;
    categoria: string;
    subcategoria: string;
    origem: string;
    valor: number | string;
    formaPagamento: string;
    status: string;
  };
};

export default function EditarFinanceiro({
  onClose,
  registro,
}: EditarFinanceiroProps) {
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

  useEffect(() => {
    if (registro) {
      setForm({
        data: registro.data || "",
        descricao: registro.descricao || "",
        categoria: registro.categoria || "",
        subcategoria: registro.subcategoria || "",
        origem: registro.origem || "",
        valor: registro.valor?.toString() || "",
        formaPagamento: registro.formaPagamento || "",
        status: registro.status || "",
      });
    }
  }, [registro]);

  const opcoesCategoria: Opcao[] = [
    { label: "Receita", value: "Receita" },
    { label: "Despesa", value: "Despesa" },
    { label: "Investimento", value: "Investimento" },
  ];

  const opcoesSubcategoria: OpcaoComCategoria[] = [
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

  const opcoesFormaPagamento: Opcao[] = [
    { label: "Pix", value: "Pix" },
    { label: "Cartão de Crédito", value: "Cartão de Crédito" },
    { label: "Cartão de Débito", value: "Cartão de Débito" },
    { label: "Dinheiro", value: "Dinheiro" },
    { label: "Boleto", value: "Boleto" },
    { label: "Transferência Bancária", value: "Transferência Bancária" },
  ];

  const opcoesStatus: Opcao[] = [
    { label: "Pendente", value: "Pendente" },
    { label: "Recebido", value: "Recebido" },
    { label: "Pago", value: "Pago" },
    { label: "Cancelado", value: "Cancelado" },
  ];

  const subcategoriasFiltradas = form.categoria
    ? opcoesSubcategoria.filter((sub) => sub.categoria === form.categoria)
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui você pode tratar os dados como quiser, por exemplo console.log:
    console.log("Dados atualizados (local):", {
      ...form,
      valor: parseFloat(form.valor.replace(",", ".")),
    });

    onClose();
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
