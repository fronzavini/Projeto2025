import { useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarCupom({ onClose, cupom }) {
  const [formData, setFormData] = useState(cupom);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados atualizados (local):", formData);
    onClose();
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
            {/* Nome */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do cupom</label>
              <input
                className={styles.input}
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tipo */}
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
                  />{" "}
                  Valor fixo
                </label>{" "}
                <label>
                  <input
                    type="radio"
                    name="tipo"
                    value="percentual"
                    checked={formData.tipo === "percentual"}
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
                  value={formData.valorDesconto}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Valor máximo de desconto</label>
                <input
                  className={styles.input}
                  name="valorMaximoDesconto"
                  type="number"
                  value={formData.valorMaximoDesconto}
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
                value={formData.valorMinimoCompra}
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
                value={formData.categoria}
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
                  value={formData.dataInicio}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Data de fim</label>
                <input
                  className={styles.input}
                  name="dataTermino"
                  type="date"
                  value={formData.dataTermino}
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
                value={formData.descricao}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
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

            {/* Usos */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Usos permitidos</label>
                <input
                  className={styles.input}
                  name="usos_permitidos"
                  type="number"
                  value={formData.usos_permitidos}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Usos realizados</label>
                <input
                  className={styles.input}
                  name="usos_realizados"
                  type="number"
                  value={formData.usos_realizados}
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