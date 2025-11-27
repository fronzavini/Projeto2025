import React from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarCliente({ onClose, cliente }) {
  console.log(cliente);
  if (!cliente) return null;

  const tipo = cliente.tipo ?? cliente.tipoPessoa ?? cliente.tipo_cliente ?? "";
  const isJuridico = String(tipo).toLowerCase() === "juridico";

  // normalizações de campos possíveis
  const cpf = cliente.cpf ?? cliente.documento ?? "";
  const cnpj = cliente.cnpj ?? cliente.cnpj_empresa ?? "";
  const rg = cliente.rg ?? "";
  const telefone = cliente.telefone ?? cliente.telefone1 ?? "";
  const dataNasc = cliente.data_nascimento ?? cliente.dataNascimento ?? "";

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
                value={cliente.nome ?? cliente.razao_social ?? ""}
                disabled
              />
            </div>

            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="fisico"
                  checked={!isJuridico}
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
                  checked={isJuridico}
                  className={styles.radioInput}
                  disabled
                />
                Jurídico
              </label>
            </div>

            {/* Campos condicionais: Físico -> CPF + RG + Data nascimento; Jurídico -> CNPJ */}
            {isJuridico ? (
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label htmlFor="cnpj" className={styles.label}>
                    CNPJ
                  </label>
                  <input
                    className={styles.input}
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    value={cnpj || cpf /* fallback caso cnpj venha no campo documento */}
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
                    value={telefone}
                    disabled
                  />
                </div>
              </div>
            ) : (
              <>
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
                      value={cpf}
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
                      value={rg}
                      disabled
                    />
                  </div>
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
                    value={telefone}
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
                    value={dataNasc ? (new Date(dataNasc).toISOString().slice(0, 10)) : ""}
                    disabled
                  />
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                value={cliente.email ?? ""}
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
                  value={cliente.cep ?? cliente.endCep ?? ""}
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
                  value={cliente.numero ?? cliente.endNumero ?? ""}
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
                  value={cliente.cidade ?? cliente.endMunicipio ?? ""}
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
                  value={cliente.bairro ?? cliente.endBairro ?? ""}
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
                value={cliente.logradouro ?? cliente.endRua ?? ""}
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
                value={cliente.complemento ?? cliente.endComplemento ?? ""}
                disabled
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}