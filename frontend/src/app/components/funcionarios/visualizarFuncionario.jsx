import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarFuncionario({ onClose, funcionario }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>
              Funcionário: {funcionario.id}
            </h2>
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
                Nome
              </label>
              <input
                className={styles.input}
                id="nome"
                name="nome"
                type="text"
                value={funcionario.nome}
                disabled
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
                  value={funcionario.cpf}
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
                  value={funcionario.rg}
                  disabled
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
                value={funcionario.data_nascimento}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="sexo" className={styles.label}>
                Sexo
              </label>
              <input
                className={styles.input}
                id="sexo"
                name="sexo"
                type="text"
                value={funcionario.sexo}
                disabled
              />
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
                value={funcionario.funcao}
                disabled
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
                value={funcionario.email}
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
                value={funcionario.telefone}
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
                  value={funcionario.cep}
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
                  value={funcionario.numero}
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
                  value={funcionario.cidade}
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
                  value={funcionario.bairro}
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
                value={funcionario.logradouro}
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
                value={funcionario.complemento}
                disabled
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
                value={funcionario.uf}
                disabled
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
