"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarDesconto({
  descontoInicial,
  onClose,
  onConfirm,
}) {
  const [form, setForm] = useState({
    ...descontoInicial,
    aplicacao: descontoInicial.produtoId ? "produto" : "tipo",
    produtoId: descontoInicial.produtoId || "",
    tipoProduto: descontoInicial.tipoProduto || "",
  });

  const [produtos, setProdutos] = useState([]);
  const [tiposProduto, setTiposProduto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const carregarProdutos = async () => {
    try {
      const response = await fetch(
        "http://192.168.18.155:5000/listar_produtos",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Erro ao carregar produtos.");
      const resultado = await response.json();

      const produtosArray = Array.isArray(resultado) ? resultado : [];
      const produtosFormatados = produtosArray.map((p) => ({
        id: p[0],
        nome: p[1],
        categoria: p[2],
      }));

      const tiposUnicos = [
        ...new Set(produtosFormatados.map((produto) => produto.categoria)),
      ];

      setProdutos(produtosFormatados);
      setTiposProduto(tiposUnicos);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProdutos([]);
      setTiposProduto([]);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const [dia, mes, ano] = form.validade.split("/");
    const validadeISO = `${ano}-${mes}-${dia}`;

    const descontoAtualizado = {
      ...form,
      validade: validadeISO,
      tipo: form.tipo === "fixo" ? "valor_fixo" : "percentual",
      produto: form.aplicacao === "produto" ? form.produtoId : form.tipoProduto,
    };

    try {
      const response = await fetch(
        `http://192.168.18.155:5000/editar_cupom/${form.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(descontoAtualizado),
        },
      );

      if (!response.ok) throw new Error("Erro ao editar desconto.");

      const result = await response.json();
      alert(result.message || "Desconto atualizado com sucesso!");
      onConfirm();
      onClose();
    } catch (error) {
      console.error("Erro ao editar desconto:", error);
      setErrorMsg("Erro ao atualizar desconto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>
              Editar Desconto: {form.codigo}
            </h2>
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
              <label htmlFor="codigo" className={styles.label}>
                Código do Desconto
              </label>
              <input
                className={styles.input}
                id="codigo"
                name="codigo"
                type="text"
                value={form.codigo}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="fixo"
                  checked={form.tipo === "fixo"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                Fixo
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="porcentagem"
                  checked={form.tipo === "porcentagem"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                Porcentagem
              </label>
            </div>

            {form.tipo === "fixo" && (
              <div className={styles.formGroup}>
                <label htmlFor="descontofixo" className={styles.label}>
                  Valor do Desconto (R$)
                </label>
                <input
                  className={styles.input}
                  id="descontofixo"
                  name="descontofixo"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.descontofixo}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {form.tipo === "porcentagem" && (
              <div className={styles.formGroup}>
                <label htmlFor="descontoPorcentagem" className={styles.label}>
                  Desconto (%)
                </label>
                <input
                  className={styles.input}
                  id="descontoPorcentagem"
                  name="descontoPorcentagem"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.descontoPorcentagem}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="validade" className={styles.label}>
                Validade
              </label>
              <input
                className={styles.input}
                id="validade"
                name="validade"
                type="text"
                placeholder="dd/mm/yyyy"
                value={form.validade}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Aplicar em:</label>
              <select
                className={styles.select}
                name="aplicacao"
                value={form.aplicacao}
                onChange={handleChange}
              >
                <option value="produto">Produto</option>
                <option value="tipo">Tipo de Produto</option>
              </select>
            </div>

            {form.aplicacao === "produto" && (
              <div className={styles.formGroup}>
                <label htmlFor="produtoId" className={styles.label}>
                  Produto
                </label>
                <select
                  className={styles.select}
                  id="produtoId"
                  name="produtoId"
                  value={form.produtoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form.aplicacao === "tipo" && (
              <div className={styles.formGroup}>
                <label htmlFor="tipoProduto" className={styles.label}>
                  Tipo de Produto
                </label>
                <select
                  className={styles.select}
                  id="tipoProduto"
                  name="tipoProduto"
                  value={form.tipoProduto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um tipo de produto</option>
                  {tiposProduto.map((tipo, index) => (
                    <option key={index} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className={styles.botaoEnviar}
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Salvar alterações"}
            </button>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
