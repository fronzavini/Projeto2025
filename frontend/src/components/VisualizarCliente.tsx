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
    data_nascimento: string;
    cep: string;
    numero: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    complemento: string;
  };
};
export default function VisualizarCliente({
  onClose,
  cliente,
}: VisualizarClienteProps) {
  console.log(cliente);
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Cliente: {cliente.id}</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <form>
            <div className={styles.formGroup}>
              <label htmlFor="nome" className={styles.label}>
                Nome do cliente
              </label>
              <input
                className={styles.input}
                id="nome"
                name="nome"
                type="text"
                value={cliente.nome}
                disabled
              />
            </div>

            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="fisico"
                  checked={cliente.tipo === "fisico"}
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
                  checked={cliente.tipo === "juridico"}
                  className={styles.radioInput}
                  disabled
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
                  value={cliente.cpf}
                  disabled
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
                  value={cliente.rg}
                  disabled
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
                value={cliente.email}
                disabled
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
                value={cliente.telefone}
                disabled
              />
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
                value={cliente.data_nascimento || ""}
                disabled
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
                  value={cliente.cep}
                  disabled
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
                  value={cliente.numero}
                  disabled
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
                  value={cliente.cidade}
                  disabled
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
                  value={cliente.bairro}
                  disabled
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
                value={cliente.logradouro}
                disabled
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
                value={cliente.complemento}
                disabled
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
