"use client";

import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarCupom({ cupom, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    ...cupom,
    dataInicio: cupom.dataInicio ? cupom.dataInicio.slice(0, 10) : "",
    dataTermino: cupom.dataTermino ? cupom.dataTermino.slice(0, 10) : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cupomAtualizado = {
      ...formData,
      valorDesconto: Number(formData.valorDesconto) || 0,
      valorMaximoDesconto: Number(formData.valorMaximoDesconto) || 0,
      valorMinimoCompra: Number(formData.valorMinimoCompra) || 0,
      usos_permitidos: Number(formData.usos_permitidos) || 0,
      usos_realizados: Number(formData.usos_realizados) || 0,
      status: formData.status === "ativo" ? "ativo" : "inativo",
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/editar_cupom/${cupom.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(cupomAtualizado),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar cupom.");

      const result = await response.json();
      alert(result.message || "Cupom atualizado com sucesso!");

      onConfirm();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar cupom:", error);
      setErrorMsg("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Editar Cupom: {cupom.id}</h2>
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
              <label className={styles.label}>Nome do cupom</label>
              <input
                className={styles.input}
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de desconto</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="tipo"
                    value="valor"
                    checked={formData.tipo === "valor"}
                    onChange={handleChange}
                  />
                  Valor fixo
                </label>

                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    name="tipo"
                    value="percentual"
                    checked={formData.tipo === "percentual"}
                    onChange={handleChange}
                  />
                  Porcentagem
                </label>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Valor do desconto</label>
                <input
                  className={styles.input}
                  type="number"
                  name="valorDesconto"
                  min="0"
                  step="0.01"
                  value={formData.valorDesconto}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Valor máximo de desconto</label>
                <input
                  className={styles.input}
                  type="number"
                  name="valorMaximoDesconto"
                  min="0"
                  step="0.01"
                  value={formData.valorMaximoDesconto}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Valor mínimo da compra</label>
              <input
                className={styles.input}
                type="number"
                name="valorMinimoCompra"
                min="0"
                step="0.01"
                value={formData.valorMinimoCompra}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Categoria</label>
              <input
                className={styles.input}
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Data de início</label>
                <input
                  className={styles.input}
                  type="date"
                  name="dataInicio"
                  value={formData.dataInicio}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Data de fim</label>
                <input
                  className={styles.input}
                  type="date"
                  name="dataTermino"
                  value={formData.dataTermino}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descrição</label>
              <textarea
                className={styles.input}
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.input}
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Usos permitidos</label>
                <input
                  className={styles.input}
                  type="number"
                  name="usos_permitidos"
                  min="0"
                  value={formData.usos_permitidos}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Usos realizados</label>
                <input
                  className={styles.input}
                  type="number"
                  name="usos_realizados"
                  min="0"
                  value={formData.usos_realizados}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.botaoEnviar}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
