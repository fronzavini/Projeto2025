import { useState, useEffect } from "react";
import styles from "../styles/CadastrarVenda.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type CadastrarDescontoProdutoProps = {
  onClose: () => void;
  onConfirm: (descontoProduto: {
    produto: string;
    precoOriginal: number;
    desconto: number;
    precoComDesconto: number;
    categoria: string;
  }) => void;
};

export default function CadastrarDescontoProduto({
  onClose,
  onConfirm,
}: CadastrarDescontoProdutoProps) {
  const [produto, setProduto] = useState("");
  const [precoOriginal, setPrecoOriginal] = useState<number | "">("");
  const [desconto, setDesconto] = useState<number | "">("");
  const [categoria, setCategoria] = useState("flores");
  const [precoComDesconto, setPrecoComDesconto] = useState(0);

  useEffect(() => {
    if (
      precoOriginal !== "" &&
      desconto !== "" &&
      precoOriginal > 0 &&
      desconto >= 0 &&
      desconto <= 100
    ) {
      const preco = precoOriginal * (1 - desconto / 100);
      setPrecoComDesconto(parseFloat(preco.toFixed(2)));
    } else {
      setPrecoComDesconto(0);
    }
  }, [precoOriginal, desconto]);

  const handleConfirmar = () => {
    if (
      produto.trim() === "" ||
      precoOriginal === "" ||
      desconto === "" ||
      categoria.trim() === ""
    )
      return;
    if (desconto! < 0 || desconto! > 100) return;

    onConfirm({
      produto: produto.trim(),
      precoOriginal: Number(precoOriginal),
      desconto: Number(desconto),
      precoComDesconto,
      categoria,
    });
    onClose();
  };

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
        <input
          className={`${styles.input} ${styles.inputDesconto}`}
          type="text"
          placeholder="Nome do produto"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
        />

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
