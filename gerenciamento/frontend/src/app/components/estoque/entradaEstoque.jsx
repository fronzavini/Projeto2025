import { useState } from "react";
import styles from "../../styles/entregue.module.css";

export default function EntradaEstoque({ onClose, produto }) {
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async () => {
    if (quantidade < 1) {
      setErrorMsg("Quantidade deve ser maior que 0");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const novaQuantidade =
        (produto.quantidade_estoque || 0) + parseInt(quantidade);

      const res = await fetch(
        `http://192.168.18.155:5000/editar_produto/${produto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: produto.nome,
            categoria: produto.categoria,
            marca: produto.marca,
            preco: produto.preco,
            quantidadeEstoque: novaQuantidade,
          }),
        },
      );

      if (!res.ok) throw new Error("Erro ao registrar entrada");

      alert(
        `Entrada registrada com sucesso! Quantidade adicionada: ${quantidade}`,
      );
      onClose();
    } catch (err) {
      console.error("Erro ao registrar entrada:", err);
      setErrorMsg("Erro ao registrar entrada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Registrar Entrada</h2>
        <p>
          Produto: <strong>{produto.nome}</strong>
        </p>
        <p>
          Quantidade atual: <strong>{produto.quantidade_estoque}</strong>
        </p>

        <input
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className={styles.input}
          style={{ width: "100%", margin: "10px 0", padding: "8px" }}
          placeholder="Digite a quantidade de entrada"
        />

        {errorMsg && (
          <p style={{ color: "red", marginBottom: "10px" }}>{errorMsg}</p>
        )}

        <div className={styles.actions}>
          <button
            className={styles.cancel}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={styles.confirm}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar entrada"}
          </button>
        </div>
      </div>
    </div>
  );
}
