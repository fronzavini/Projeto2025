import { useState } from "react";
import styles from "../styles/CadastrarCliente.module.css";

type VisualizarProdutoProps = {
  onClose: () => void;
  produto: {
    id: string;
    nome: string;
    categoria: string;
    marca: string;
    preco: number;
    quantidade_estoque: number;
    estoque_minimo: number;
    estado: boolean;
    fornecedor_id: number;
    imagem: string;
  };
};

export default function EditarProduto({
  onClose,
  produto,
}: VisualizarProdutoProps) {
  const [formData, setFormData] = useState(produto);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Por enquanto só loga localmente e fecha modal
    console.log("Produto atualizado (local):", formData);
    onClose();
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
              <label htmlFor="nome" className={styles.label}>
                Nome
              </label>
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
              <label htmlFor="categoria" className={styles.label}>
                Categoria
              </label>
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
              <label htmlFor="marca" className={styles.label}>
                Marca
              </label>
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
                <label htmlFor="preco" className={styles.label}>
                  Preço
                </label>
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
                <label htmlFor="quantidade_estoque" className={styles.label}>
                  Qtd. Estoque
                </label>
                <input
                  className={styles.input}
                  id="quantidade_estoque"
                  name="quantidade_estoque"
                  type="number"
                  value={formData.quantidade_estoque}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="estoque_minimo" className={styles.label}>
                  Estoque Mínimo
                </label>
                <input
                  className={styles.input}
                  id="estoque_minimo"
                  name="estoque_minimo"
                  type="number"
                  value={formData.estoque_minimo}
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
                value={formData.imagem}
                onChange={handleChange}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="fornecedor_id" className={styles.label}>
                  Fornecedor ID
                </label>
                <input
                  className={styles.input}
                  id="fornecedor_id"
                  name="fornecedor_id"
                  type="number"
                  value={formData.fornecedor_id}
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
                  checked={formData.estado}
                  onChange={handleChange}
                />
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
