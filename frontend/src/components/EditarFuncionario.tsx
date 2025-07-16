import { useState } from "react";
import styles from "../styles/cadastrarCliente.module.css";

type EditarFuncionarioProps = {
  onClose: () => void;
  funcionario: {
    id: string;
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    telefone: string;
    data_nascimento: string;
    sexo: "masculino" | "feminino" | "outro";
    cep: string;
    numero: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    complemento: string;
    uf: string;
    funcao: string;
    senha?: string; // opcional
  };
};

export default function EditarFuncionario({
  onClose,
  funcionario,
}: EditarFuncionarioProps) {
  const [formData, setFormData] = useState(funcionario);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Funcionário atualizado (local):", formData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>
              Editar Funcionário: {formData.id}
            </h2>
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
              />
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
              <label htmlFor="data_nascimento" className={styles.label}>
                Data de nascimento
              </label>
              <input
                className={styles.inputDate}
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="sexo" className={styles.label}>
                Sexo
              </label>
              <select
                className={styles.input}
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="funcao" className={styles.label}>
                Função
              </label>
              <input
                className={styles.input}
                id="funcao"
                name="funcao"
                type="text"
                value={formData.funcao}
                onChange={handleChange}
              />
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

            <div className={styles.formGroup}>
              <label htmlFor="uf" className={styles.label}>
                UF
              </label>
              <input
                className={styles.input}
                id="uf"
                name="uf"
                type="text"
                maxLength={2}
                value={formData.uf}
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
