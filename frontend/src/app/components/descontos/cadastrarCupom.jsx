import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarCupom({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "percentual",
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

      if (!response.ok) throw new Error("Erro ao cadastrar cupom.");

      alert("Cupom cadastrado com sucesso!");
      onClose();

      setForm({
        nome: "",
        tipo: "percentual",
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
      alert("Erro ao cadastrar cupom.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo cupom</h2>
        <button
          className={styles.botaoCancelar}
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nome do cupom */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome do cupom</label>
          <input
            className={styles.input}
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tipo de desconto */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tipo de desconto</label>
          <div>
            <label>
              <input
                type="radio"
                name="tipo"
                value="valor"
                checked={form.tipo === "valor"}
                onChange={handleChange}
              />{" "}
              Valor fixo
            </label>
            {"  "}
            <label>
              <input
                type="radio"
                name="tipo"
                value="percentual"
                checked={form.tipo === "percentual"}
                onChange={handleChange}
              />{" "}
              Porcentagem
            </label>
          </div>
        </div>

        {/* Valores */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Valor do desconto</label>
            <input
              className={styles.input}
              name="valorDesconto"
              type="number"
              value={form.valorDesconto}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Valor máximo de desconto</label>
            <input
              className={styles.input}
              name="valorMaximoDesconto"
              type="number"
              value={form.valorMaximoDesconto}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Valor mínimo da compra</label>
          <input
            className={styles.input}
            name="valorMinimoCompra"
            type="number"
            value={form.valorMinimoCompra}
            onChange={handleChange}
          />
        </div>

        {/* Categoria */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Categoria</label>
          <input
            className={styles.input}
            name="categoria"
            type="text"
            value={form.categoria}
            onChange={handleChange}
          />
        </div>

        {/* Datas */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Data de início</label>
            <input
              className={styles.input}
              name="dataInicio"
              type="date"
              value={form.dataInicio}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Data de fim</label>
            <input
              className={styles.input}
              name="dataTermino"
              type="date"
              value={form.dataTermino}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Descrição */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição</label>
          <textarea
            className={styles.input}
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.input}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {/* Usos */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Usos permitidos</label>
            <input
              className={styles.input}
              name="usos_permitidos"
              type="number"
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
              value={form.usos_realizados}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Botão */}
        <button type="submit" className={styles.botaoEnviar}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}
