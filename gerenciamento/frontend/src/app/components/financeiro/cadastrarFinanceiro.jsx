import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarFinanceiro({ onClose }) {
  const [form, setForm] = useState({
    data: "",
    tipo: "",
    categoria: "",
    descricao: "",
    valor: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const opcoesTipo = [
    { label: "Entrada", value: "entrada" },
    { label: "Saída", value: "saida" },
  ];

  const opcoesCategoria = [
    { label: "Venda", value: "venda" },
    { label: "Aluguel", value: "aluguel" },
    { label: "Compra de Insumos", value: "compra_insumos" },
    { label: "Marketing", value: "marketing" },
    { label: "Serviço", value: "servico" },
    { label: "Equipamentos", value: "equipamentos" },
    { label: "Outro", value: "outro" },
  ];

  // mapeamento de categoria -> tipo esperado ('' = indiferente)
  const categoriaParaTipo = {
    venda: "entrada",
    aluguel: "entrada",
    servico: "entrada",
    compra_insumos: "saida",
    marketing: "saida",
    equipamentos: "saida",
    outro: "",
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => {
      const next = { ...old, [name]: value };

      // se o usuário escolher uma categoria, forçar/ajustar o tipo quando apropriado
      if (name === "categoria") {
        const mapped = categoriaParaTipo[value];
        if (mapped) next.tipo = mapped;
      }

      // se o usuário escolher um tipo, limpar categoria se ela não pertence ao tipo
      if (name === "tipo") {
        // permitir categorias que sejam mapeadas para esse tipo ou que sejam 'outro'
        const permitidas = opcoesCategoria
          .map((c) => c.value)
          .filter(
            (cat) =>
              !categoriaParaTipo[cat] ||
              categoriaParaTipo[cat] === value ||
              categoriaParaTipo[cat] === "",
          );
        if (next.categoria && !permitidas.includes(next.categoria)) {
          next.categoria = "";
        }
      }

      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const dadosParaEnviar = {
        tipo: form.tipo,
        categoria: form.categoria,
        descricao: form.descricao,
        valor: parseFloat(form.valor),
        data: form.data,
      };

      const response = await fetch(
        "http://192.168.18.155:5000/criar_transacaofinanceira",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        },
      );

      if (!response.ok) throw new Error("Erro ao cadastrar transação.");

      alert("Transação cadastrada com sucesso!");
      onClose();

      setForm({
        data: "",
        tipo: "",
        categoria: "",
        descricao: "",
        valor: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMsg("Erro ao cadastrar transação.");
    } finally {
      setLoading(false);
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

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="tipo" className={styles.label}>
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              className={styles.input}
              value={form.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo</option>
              {opcoesTipo.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

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
              {opcoesCategoria
                .filter((op) => {
                  // se tipo estiver definido, mostrar apenas categorias compatíveis ou 'outro'
                  if (!form.tipo) return true;
                  const mapped = categoriaParaTipo[op.value];
                  return mapped === "" || mapped === form.tipo;
                })
                .map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
            </select>
          </div>
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

        {errorMsg && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</p>
        )}

        <button type="submit" className={styles.botaoEnviar} disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar transação"}
        </button>
      </form>
    </div>
  );
}
