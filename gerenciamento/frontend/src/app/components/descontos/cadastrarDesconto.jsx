import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CadastrarDesconto({ onClose, onConfirm }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    valorDesconto: 0,
    valorMaximoDesconto: 0,
    valorMinimoCompra: 0,
    categoria: "",
    dataInicio: "",
    dataTermino: "",
    descricao: "",
    status: "ativo",
    usos_permitidos: 0,
    usos_realizados: 0,
  });
  const [produtos, setProdutos] = useState([]);
  const [produto, setProduto] = useState("");

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch("http://localhost:5000/produtos");
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }
    fetchProdutos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/incluir_cupom", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar desconto.");

      alert("Cupom cadastrado com sucesso!");
      onClose();

      setForm({
        nome: "",
        tipo: "",
        valorDesconto: 0,
        valorMaximoDesconto: 0,
        valorMinimoCompra: 0,
        categoria: "",
        dataInicio: "",
        dataTermino: "",
        descricao: "",
        status: "ativo",
        usos_permitidos: 0,
        usos_realizados: 0,
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar desconto.");
    }
  }
  return (
    <div className={styles.overlay}>
      <div className={`${styles.container} ${styles.modalDesconto}`}>
        <div className={`${styles.header} ${styles.headerDesconto}`}>
          <h2 className={`${styles.title} ${styles.titleDesconto}`}>
            Cadastrar Desconto
          </h2>

          <button className={styles.cancelar} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <label className={styles.titulo}>Produto</label>
        <select
          className={`${styles.input} ${styles.inputDesconto}`}
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
        >
          <option value="">Selecione um produto</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.nome}>
              {p.nome}
            </option>
          ))}
        </select>

        <label className={styles.titulo}>Preço Original (R$)</label>
        <input
          className={`${styles.input} ${styles.inputDesconto}`}
          type="number"
          min={0}
          step={0.01}
          placeholder="Ex: 120.00"
          value={precoOriginal}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              setPrecoOriginal("");
              return;
            }
            const num = parseFloat(val);
            if (!isNaN(num) && num >= 0) setPrecoOriginal(num);
          }}
        />

        <label className={styles.titulo}>Desconto (%)</label>
        <input
          className={`${styles.input} ${styles.inputDesconto}`}
          type="number"
          min={0}
          max={100}
          step={0.01}
          placeholder="Ex: 10"
          value={desconto}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              setDesconto("");
              return;
            }
            const num = parseFloat(val);
            if (!isNaN(num) && num >= 0 && num <= 100) setDesconto(num);
          }}
        />

        <label className={styles.titulo}>Categoria</label>
        <select
          className={`${styles.select} ${styles.inputDesconto}`}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="flores">Flores</option>
          <option value="arranjos">Arranjos</option>
          <option value="vasos">Vasos</option>
        </select>

        <label className={styles.titulo}>Preço com desconto (calculado)</label>
        <input
          className={`${styles.input} ${styles.inputDesconto} ${styles.inputReadOnly}`}
          type="text"
          value={`R$ ${precoComDesconto.toFixed(2)}`}
          readOnly
        />

        <button className={styles.confirmarVenda} onClick={handleConfirmar}>
          Confirmar Desconto
        </button>
      </div>
    </div>
  );
}