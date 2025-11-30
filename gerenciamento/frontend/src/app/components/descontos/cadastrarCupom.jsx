import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarCupom({ onClose }) {
  const [form, setForm] = useState({
    codigo: "",
    tipo: "valor_fixo", // valor_fixo | percentual | frete
    descontofixo: 0,
    descontoPorcentagem: 0,
    descontofrete: 0,
    validade: "",
    usos_permitidos: 0,
    usos_realizados: 0,
    valor_minimo: 0,
    estado: true,
    aplicacao: "produto",
    tipo_produto: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [tiposProduto, setTiposProduto] = useState([]);

  // Carrega produtos e categorias
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetch("http://localhost:5000/listar_produtos");
        if (!res.ok) throw new Error("Erro ao carregar produtos.");
        const data = await res.json();
        const produtosFormatados = Array.isArray(data)
          ? data.map((p) => ({ id: p[0], nome: p[1], categoria: p[2] }))
          : [];
        setProdutos(produtosFormatados);
        setTiposProduto([
          ...new Set(produtosFormatados.map((p) => p.categoria)),
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    carregarProdutos();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Converte a data para formato yyyy-mm-dd
    const [dia, mes, ano] = form.validade.split("/");
    const validadeISO = `${ano}-${mes}-${dia}`;

    const cupomData = {
      codigo: form.codigo,
      tipo: form.tipo, // valor_fixo | percentual | frete
      descontofixo: form.descontofixo,
      descontoPorcentagem: form.descontoPorcentagem,
      descontofrete: form.descontofrete,
      validade: validadeISO,
      usos_permitidos: parseInt(form.usos_permitidos) || 0,
      usos_realizados: parseInt(form.usos_realizados) || 0,
      valor_minimo: parseFloat(form.valor_minimo) || 0,
      estado: form.estado ? 1 : 0,
      aplicacao: form.aplicacao,
      tipo_produto:
        form.aplicacao === "tipo_produto" ? form.tipo_produto : form.produto,
    };

    try {
      const res = await fetch("http://localhost:5000/criar_cupom", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cupomData),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar cupom.");
      alert("Cupom cadastrado com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar cupom.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo Cupom</h2>
        <button
          className={styles.botaoCancelar}
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Código */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Código do cupom</label>
          <input
            className={styles.input}
            name="codigo"
            type="text"
            value={form.codigo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tipo de desconto */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tipo de desconto</label>
          <select
            className={styles.select}
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
          >
            <option value="valor_fixo">Valor fixo (R$)</option>
            <option value="percentual">Percentual (%)</option>
            <option value="frete">Frete (%)</option>
          </select>
        </div>

        {/* Valores lado a lado */}
        <div className={styles.row}>
          {form.tipo === "valor_fixo" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Desconto (R$)</label>
              <input
                className={styles.input}
                type="number"
                name="descontofixo"
                value={form.descontofixo}
                min="0"
                onChange={handleChange}
              />
            </div>
          )}

          {form.tipo === "percentual" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Desconto (%)</label>
              <input
                className={styles.input}
                type="number"
                name="descontoPorcentagem"
                value={form.descontoPorcentagem}
                min="0"
                max="100"
                onChange={handleChange}
              />
            </div>
          )}

          {form.tipo === "frete" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Frete (%)</label>
              <input
                className={styles.input}
                type="number"
                name="descontofrete"
                value={form.descontofrete}
                min="0"
                max="100"
                onChange={handleChange}
              />
            </div>
          )}

          {/* Valor mínimo */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Valor mínimo (R$)</label>
            <input
              className={styles.input}
              type="number"
              name="valor_minimo"
              value={form.valor_minimo}
              min="0"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Validade */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Validade</label>
          <input
            className={styles.input}
            name="validade"
            type="text"
            placeholder="dd/mm/yyyy"
            value={form.validade}
            onChange={handleChange}
            required
          />
        </div>

        {/* Usos lado a lado */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Usos permitidos</label>
            <input
              className={styles.input}
              name="usos_permitidos"
              type="number"
              min="0"
              value={form.usos_permitidos}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Usos realizados</label>
            <input
              className={styles.input}
              name="usos_realizados"
              type="number"
              min="0"
              value={form.usos_realizados}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Estado */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              name="estado"
              checked={form.estado}
              onChange={handleChange}
            />{" "}
            Ativo
          </label>
        </div>

        {/* Produto ou Tipo */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Aplicar em:</label>
          <select
            className={styles.select}
            name="aplicacao"
            value={form.aplicacao}
            onChange={handleChange}
          >
            <option value="produto">Produto</option>
            <option value="tipo_produto">Tipo de Produto</option>
          </select>
        </div>

        {form.aplicacao === "produto" && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Produto</label>
            <select
              className={styles.select}
              name="tipo_produto"
              value={form.tipo_produto}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.nome}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.aplicacao === "tipo_produto" && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de Produto</label>
            <select
              className={styles.select}
              name="tipo_produto"
              value={form.tipo_produto}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              {tiposProduto.map((tipo, i) => (
                <option key={i} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className={styles.botaoEnviar}>
          Cadastrar Cupom
        </button>
      </form>
    </div>
  );
}
