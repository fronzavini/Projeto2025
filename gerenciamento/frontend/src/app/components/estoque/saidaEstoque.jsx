import { useState } from "react";
import styles from "../../styles/entregue.module.css";

export default function SaidaEstoque({ onClose, produto }) {
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async () => {
    const quantAtual = produto.quantidade_estoque || 0;

    if (quantidade < 1) {
      setErrorMsg("Quantidade deve ser maior que 0");
      return;
    }

    if (parseInt(quantidade) > quantAtual) {
      setErrorMsg(`Quantidade insuficiente em estoque (disponível: ${quantAtual})`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const novaQuantidade = quantAtual - parseInt(quantidade);

      const res = await fetch(`http://191.52.6.89:5000/editar_produto/${produto.id}`, {
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
      });

      if (!res.ok) throw new Error("Erro ao registrar saída");

      alert(`Saída registrada com sucesso! Quantidade removida: ${quantidade}`);
      onClose();
    } catch (err) {
      console.error("Erro ao registrar saída:", err);
      setErrorMsg("Erro ao registrar saída");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Registrar Saída</h2>
        <p>
          Produto: <strong>{produto.nome}</strong>
        </p>
        <p>
          Quantidade disponível: <strong>{produto.quantidade_estoque}</strong>
        </p>

        <input
          type="number"
          min="1"
          max={produto.quantidade_estoque}
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className={styles.input}
          style={{ width: "100%", margin: "10px 0", padding: "8px" }}
          placeholder="Digite a quantidade de saída"
        />

        {errorMsg && <p style={{ color: "red", marginBottom: "10px" }}>{errorMsg}</p>}

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className={styles.confirm} onClick={handleSubmit} disabled={loading}>
            {loading ? "Registrando..." : "Registrar saída"}
          </button>
        </div>
      </div>
    </div>
  );
}