import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarFinanceiro({ onClose, registro }) {
  const [form, setForm] = useState({
    data: "",
    tipo: "",
    categoria: "",
    descricao: "",
    valor: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (registro) {
      setForm({
        data: registro.data || "",
        tipo: registro.tipo || "",
        categoria: registro.categoria || "",
        descricao: registro.descricao || "",
        valor: registro.valor?.toString() || "",
      });
    }
  }, [registro]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        tipo: form.tipo,
        categoria: form.categoria,
        descricao: form.descricao,
        valor: parseFloat(form.valor),
        data: form.data,
      };

      const res = await fetch(
        `http://192.168.18.155:5000/editar_transacaofinanceira/${registro.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Erro ao atualizar transação");

      alert("Transação atualizada com sucesso!");
      onClose();
    } catch (err) {
      console.error("Erro:", err);
      setErrorMsg("Erro ao atualizar transação");
    } finally {
      setLoading(false);
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

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="tipo" className={styles.label}>
                  Tipo
                </label>
                <select
                  className={styles.input}
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione tipo</option>
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
                  className={styles.input}
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

            {errorMsg && (
              <p style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              className={styles.botaoEnviar}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
