import { useState } from "react";
import styles from "../styles/cadastrarCliente.module.css";

type VisualizarClienteProps = {
  onClose: () => void;
  cliente: {
    id: string;
    nome: string;
    tipo: "fisico" | "juridico";
    cpf: string;
    rg: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    cep: string;
    numero: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    complemento: string;
  };
};

export default function EditarCliente({
  onClose,
  cliente,
}: VisualizarClienteProps) {
  const [formData, setFormData] = useState(cliente);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? (e.target as HTMLInputElement).value : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Apenas fecha o modal por enquanto
    console.log("Dados atualizados (local):", formData);
    onClose();
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

            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="fisico"
                  checked={formData.tipo === "fisico"}
                  onChange={handleChange}
                  className={styles.radioInput}
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
                />
                Jurídico
              </label>
            </div>

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

            <button type="submit" className={styles.botaoEnviar}>
              Salvar alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
