import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

// Função para formatar a data para YYYY-MM-DD
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EditarCliente({ onClose, cliente }) {
  const [formData, setFormData] = useState({
    ...cliente,
    dataNascimento: formatDate(cliente.dataNascimento),
    tipo: cliente.tipo?.toLowerCase() === "juridico" ? "juridico" : "fisico",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        ...formData,
        data_nascimento: formData.dataNascimento, // backend espera data_nascimento
      };
      delete payload.dataNascimento;

      const response = await fetch(
        `http://localhost:5000/editar_cliente/${cliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.resultado === "ok") {
        alert("Cliente atualizado com sucesso!");
        onClose();
      } else {
        setErrorMsg(result.detalhes || "Erro ao atualizar cliente.");
      }
    } catch (error) {
      setErrorMsg("Erro de rede ao atualizar cliente.");
      console.error("Erro no fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Editar Cliente: {cliente.id}</h2>
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
              <label htmlFor="nome" className={styles.label}>
                Nome do cliente
              </label>
              <input
                className={styles.input}
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>

            {/* Tipo */}
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="fisico"
                  checked={formData.tipo === "fisico"}
                  onChange={handleChange}
                  className={styles.radioInput}
                  disabled
                />
                Físico
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="juridico"
                  checked={formData.tipo === "juridico"}
                  onChange={handleChange}
                  className={styles.radioInput}
                  disabled
                />
                Jurídico
              </label>
            </div>

            {/* CPF e RG */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="cpf" className={styles.label}>
                  CPF
                </label>
                <input
                  className={styles.input}
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="rg" className={styles.label}>
                  RG
                </label>
                <input
                  className={styles.input}
                  id="rg"
                  name="rg"
                  type="text"
                  value={formData.rg}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email e Telefone */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefone" className={styles.label}>
                Telefone
              </label>
              <input
                className={styles.input}
                id="telefone"
                name="telefone"
                type="text"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>

            {/* Data de nascimento */}
            <div className={styles.formGroup}>
              <label htmlFor="dataNascimento" className={styles.label}>
                Data de nascimento
              </label>
              <input
                className={styles.inputDate}
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={handleChange}
              />
            </div>

            {/* Endereço */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="cep" className={styles.label}>
                  CEP
                </label>
                <input
                  className={styles.input}
                  id="cep"
                  name="cep"
                  type="text"
                  value={formData.cep}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="numero" className={styles.label}>
                  Número
                </label>
                <input
                  className={styles.input}
                  id="numero"
                  name="numero"
                  type="text"
                  value={formData.numero}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="cidade" className={styles.label}>
                  Cidade
                </label>
                <input
                  className={styles.input}
                  id="cidade"
                  name="cidade"
                  type="text"
                  value={formData.cidade}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bairro" className={styles.label}>
                  Bairro
                </label>
                <input
                  className={styles.input}
                  id="bairro"
                  name="bairro"
                  type="text"
                  value={formData.bairro}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="logradouro" className={styles.label}>
                Logradouro
              </label>
              <input
                className={styles.input}
                id="logradouro"
                name="logradouro"
                type="text"
                value={formData.logradouro}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complemento" className={styles.label}>
                Complemento
              </label>
              <input
                className={styles.input}
                id="complemento"
                name="complemento"
                type="text"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>

            {/* Erro */}
            {errorMsg && (
              <div style={{ color: "red", marginBottom: "1rem" }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className={styles.botaoEnviar}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
