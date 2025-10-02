import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarProduto({ onClose, produto }) {
  const [formData, setFormData] = useState({
    ...produto,
    preco: Number(produto.preco), // garante que seja número
    quantidadeEstoque: Number(produto.quantidade_estoque), // adapta para backend
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Prepara payload conforme backend
    const payload = {
      nome: formData.nome,
      categoria: formData.categoria,
      marca: formData.marca,
      preco: Number(formData.preco),
      quantidadeEstoque: Number(formData.quantidadeEstoque),
    };

    try {
      const response = await fetch(
        `http://localhost:5000/editar_produto/${produto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar produto.");

      const result = await response.json();
      alert(result.message || "Produto atualizado com sucesso!");
      onClose(); // fecha modal
    } catch (error) {
      console.error("Erro no fetch:", error);
      setErrorMsg("Erro ao atualizar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Editar Produto: {produto.id}</h2>
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
              <label htmlFor="nome" className={styles.label}>Nome</label>
              <input
                className={styles.input}
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoria" className={styles.label}>Categoria</label>
              <input
                className={styles.input}
                id="categoria"
                name="categoria"
                type="text"
                value={formData.categoria}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="marca" className={styles.label}>Marca</label>
              <input
                className={styles.input}
                id="marca"
                name="marca"
                type="text"
                value={formData.marca}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="preco" className={styles.label}>Preço</label>
                <input
                  className={styles.input}
                  id="preco"
                  name="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="quantidadeEstoque" className={styles.label}>Qtd. Estoque</label>
                <input
                  className={styles.input}
                  id="quantidadeEstoque"
                  name="quantidadeEstoque"
                  type="number"
                  value={formData.quantidadeEstoque}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/*<div className={styles.formGroup}>
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
            </div>*/}

            <button type="submit" className={styles.botaoEnviar} disabled={loading}>
              {loading ? "Atualizando..." : "Salvar alterações"}
            </button>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}