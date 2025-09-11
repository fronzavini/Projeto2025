import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarProduto({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    marca: "",
    preco: "",
    quantidade_estoque: "",
    estoque_minimo: "",
    estado: true,
    fornecedor_id: "",
    imagem: "",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dadosCompletos = {
      ...form,
      preco: parseFloat(form.preco),
      quantidade_estoque: parseInt(form.quantidade_estoque),
      estoque_minimo: parseInt(form.estoque_minimo),
      fornecedor_id: parseInt(form.fornecedor_id),
    };

    try {
      const response = await fetch("http://localhost:5000/incluir_produto", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCompletos),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar produto.");

      alert("Produto cadastrado com sucesso!");
      onClose();

      setForm({
        nome: "",
        categoria: "",
        marca: "",
        preco: "",
        quantidade_estoque: "",
        estoque_minimo: "",
        estado: true,
        fornecedor_id: "",
        imagem: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar produto.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo produto</h2>
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
          <label htmlFor="nome" className={styles.label}>
            Nome
          </label>
          <input
            className={styles.input}
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categoria" className={styles.label}>
            Categoria
          </label>
          <input
            className={styles.input}
            id="categoria"
            name="categoria"
            type="text"
            value={form.categoria}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="marca" className={styles.label}>
            Marca
          </label>
          <input
            className={styles.input}
            id="marca"
            name="marca"
            type="text"
            value={form.marca}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="preco" className={styles.label}>
              Preço
            </label>
            <input
              className={styles.input}
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              value={form.preco}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="quantidade_estoque" className={styles.label}>
              Quantidade em estoque
            </label>
            <input
              className={styles.input}
              id="quantidade_estoque"
              name="quantidade_estoque"
              type="number"
              value={form.quantidade_estoque}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estoque_minimo" className={styles.label}>
              Estoque mínimo
            </label>
            <input
              className={styles.input}
              id="estoque_minimo"
              name="estoque_minimo"
              type="number"
              value={form.estoque_minimo}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imagem" className={styles.label}>
            URL da Imagem
          </label>
          <input
            className={styles.input}
            id="imagem"
            name="imagem"
            type="text"
            value={form.imagem}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="fornecedor_id" className={styles.label}>
              ID do Fornecedor
            </label>
            <input
              className={styles.input}
              id="fornecedor_id"
              name="fornecedor_id"
              type="number"
              value={form.fornecedor_id}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estado" className={styles.label}>
              Ativo
            </label>
            <input
              className={styles.checkbox}
              id="estado"
              name="estado"
              type="checkbox"
              checked={form.estado}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.botaoEnviar}>
          Cadastrar produto
        </button>
      </form>
    </div>
  );
}
