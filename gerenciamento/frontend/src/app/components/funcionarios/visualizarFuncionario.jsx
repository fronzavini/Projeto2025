"use client";
import styles from "../../styles/cadastrarCliente.module.css";

function normalizeDateToInput(value) {
  if (!value) return "";
  // Date object
  if (value instanceof Date && !isNaN(value)) {
    return value.toISOString().slice(0, 10);
  }
  const s = String(value).trim();

  // ISO com hora -> pega só AAAA-MM-DD
  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;

  // DD/MM/AAAA -> converte
  const dmy = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;

  // Tenta parsear genericamente
  const d = new Date(s);
  if (!isNaN(d)) return d.toISOString().slice(0, 10);

  return "";
}

// Lê a primeira chave disponível
function pick(obj, keys, fallback = "") {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== "") return obj[k];
  }
  return fallback;
}

// Mapeia qualquer formato que venha do backend para o que a UI precisa
function mapFuncionario(raw) {
  if (!raw) return {};

  const mapped = {
    id: pick(raw, ["id"]),
    nome: pick(raw, ["nome"]),
    cpf: pick(raw, ["cpf"]),
    rg: pick(raw, ["rg"]),
    sexo: pick(raw, ["sexo"]),
    funcao: pick(raw, ["funcao"]),

    // datas com normalização
    data_nascimento: normalizeDateToInput(
      pick(raw, ["data_nascimento", "dataNasc", "dataNascimento"])
    ),
    data_contratacao: normalizeDateToInput(
      pick(raw, ["data_contratacao", "dataContratacao"])
    ),

    email: pick(raw, ["email"]),
    telefone: pick(raw, ["telefone"]),

    // endereço: converte end* -> campos exibidos no form
    cep: pick(raw, ["cep", "endCep"]),
    numero: pick(raw, ["numero", "endNumero"]),
    cidade: pick(raw, ["cidade", "endMunicipio"]),
    bairro: pick(raw, ["bairro", "endBairro"]),
    logradouro: pick(raw, ["logradouro", "endRua"]),
    complemento: pick(raw, ["complemento", "endComplemento"]),
    uf: pick(raw, ["uf", "endUF"]),

    // status
    estado: (() => {
      const v = pick(raw, ["estado"], null);
      return typeof v === "string"
        ? v === "1" || v.toLowerCase() === "true"
        : !!v;
    })(),

    // salário (mantém número/str; não formata para não quebrar input type=number)
    salario: pick(raw, ["salario"], ""),
  };

  return mapped;
}

export default function VisualizarFuncionario({ onClose, funcionario }) {
  const f = mapFuncionario(funcionario);

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Funcionário: {f.id}</h2>
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
                value={f.nome || ""}
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
                  value={f.cpf || ""}
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
                  value={f.rg || ""}
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
                value={f.data_nascimento || ""}
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
                value={f.sexo || ""}
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
                value={f.funcao || ""}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="salario" className={styles.label}>
                Salário
              </label>
              <input
                className={styles.input}
                id="salario"
                name="salario"
                type="number"
                value={f.salario || ""}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="data_contratacao" className={styles.label}>
                Data de Contratação
              </label>
              <input
                className={styles.inputDate}
                id="data_contratacao"
                name="data_contratacao"
                type="date"
                value={f.data_contratacao || ""}
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
                value={f.email || ""}
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
                value={f.telefone || ""}
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
                  value={f.cep || ""}
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
                  value={f.numero || ""}
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
                  value={f.cidade || ""}
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
                  value={f.bairro || ""}
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
                value={f.logradouro || ""}
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
                value={f.complemento || ""}
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
                value={f.uf || ""}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="estado" className={styles.label}>
                Estado (Ativo/Inativo)
              </label>
              <input
                className={styles.input}
                id="estado"
                name="estado"
                type="text"
                value={f.estado ? "Ativo" : "Inativo"}
                disabled
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
