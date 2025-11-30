import React from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarCliente({ onClose, cliente }) {
  if (!cliente) return null;

  // garantir uso das chaves da tabela
  const tipo = cliente.tipo ?? "fisico";
  const isJuridico = String(tipo).toLowerCase() === "juridico";

  const cpf = cliente.cpf ?? "";
  const cnpj = cliente.cnpj ?? "";
  const rg = cliente.rg ?? "";
  const telefone = cliente.telefone ?? "";
  const dataNasc = cliente.dataNasc ?? cliente.data_nascimento ?? cliente.dataNascimento ?? "";
  const email = cliente.email ?? "";

  const endCep = cliente.endCep ?? cliente.end_cep ?? cliente.cep ?? "";
  const endRua = cliente.endRua ?? cliente.end_rua ?? cliente.logradouro ?? "";
  const endNumero = cliente.endNumero ?? cliente.end_numero ?? cliente.numero ?? "";
  const endBairro = cliente.endBairro ?? cliente.end_bairro ?? cliente.bairro ?? "";
  const endComplemento = cliente.endComplemento ?? cliente.end_complemento ?? cliente.complemento ?? "";
  const endUF = cliente.endUF ?? cliente.end_uf ?? cliente.uf ?? "";
  const endMunicipio = cliente.endMunicipio ?? cliente.end_municipio ?? cliente.cidade ?? "";

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
              <label className={styles.label}>Nome do cliente</label>
              <input
                className={styles.input}
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

            {isJuridico ? (
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CNPJ</label>
                  <input className={styles.input} type="text" value={cnpj || ""} disabled />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Telefone</label>
                  <input className={styles.input} type="text" value={telefone || ""} disabled />
                </div>
              </div>
            ) : (
              <>
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>CPF</label>
                    <input className={styles.input} type="text" value={cpf || ""} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>RG</label>
                    <input className={styles.input} type="text" value={rg || ""} disabled />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Telefone</label>
                  <input className={styles.input} type="text" value={telefone || ""} disabled />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Data de nascimento</label>
                  <input
                    className={styles.inputDate}
                    type="date"
                    value={dataNasc ? new Date(dataNasc).toISOString().slice(0, 10) : ""}
                    disabled
                  />
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" value={email} disabled />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>CEP</label>
                <input className={styles.input} type="text" value={endCep} disabled />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Número</label>
                <input className={styles.input} type="text" value={endNumero} disabled />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Município</label>
                <input className={styles.input} type="text" value={endMunicipio} disabled />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bairro</label>
                <input className={styles.input} type="text" value={endBairro} disabled />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Rua</label>
              <input className={styles.input} type="text" value={endRua} disabled />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Complemento</label>
              <input className={styles.input} type="text" value={endComplemento} disabled />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>UF</label>
              <input className={styles.input} type="text" value={endUF} disabled />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
