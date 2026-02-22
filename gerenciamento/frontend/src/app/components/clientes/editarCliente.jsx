"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

// Normaliza vários formatos para YYYY-MM-DD sem estourar fuso
function toInputDate(v) {
  if (!v) return "";
  // já está em yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

  // tenta pegar só a parte da data se vier "yyyy-mm-ddTHH:mm:ss"
  const match = String(v).match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];

  // fallback: Date seguro usando UTC -> local yyyy-mm-dd
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EditarCliente({ cliente, onClose, onSalvar }) {
  const isPF = useMemo(
    () => (cliente?.tipo || "fisico") === "fisico",
    [cliente?.tipo]
  );

  const [form, setForm] = useState({
    nome: "",
    tipo: "fisico",
    sexo: "",
    cpf: "",
    cnpj: "",
    rg: "",
    email: "",
    telefone: "",
    dataNasc: "",
    endCep: "",
    endNumero: "",
    endUF: "",
    endMunicipio: "",
    endBairro: "",
    endRua: "",
    endComplemento: "",
  });

  useEffect(() => {
    if (!cliente) return;
    setForm({
      nome: cliente.nome ?? "",
      tipo: cliente.tipo ?? "fisico",
      sexo: cliente.sexo ?? "",
      cpf: cliente.cpf ?? "",
      cnpj: cliente.cnpj ?? "",
      rg: cliente.rg ?? "",
      email: cliente.email ?? "",
      telefone: cliente.telefone ?? "",
      dataNasc: toInputDate(cliente.dataNasc || cliente.data_nascimento),
      endCep: cliente.endCep || cliente.cep || "",
      endNumero: cliente.endNumero || cliente.numero || "",
      endUF: cliente.endUF || cliente.uf || "",
      endMunicipio: cliente.endMunicipio || cliente.cidade || "",
      endBairro: cliente.endBairro || cliente.bairro || "",
      endRua: cliente.endRua || cliente.logradouro || "",
      endComplemento: cliente.endComplemento || cliente.complemento || "",
    });
  }, [cliente]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cliente?.id) return;

    // ✅ payload com os nomes que o backend espera em /editar_cliente/<id>
    const payload = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,

      // endereço
      cep: form.endCep,
      logradouro: form.endRua,
      numero: form.endNumero,
      bairro: form.endBairro,
      complemento: form.endComplemento,
      uf: form.endUF,
      cidade: form.endMunicipio,

      // documentos
      cpf: form.tipo === "fisico" ? form.cpf : null,
      rg: form.tipo === "fisico" ? form.rg : null,
      sexo: form.tipo === "fisico" ? form.sexo : null,
      data_nascimento: form.tipo === "fisico" ? form.dataNasc : null,
      cnpj: form.tipo === "juridico" ? form.cnpj : null,
    };

    try {
      const resp = await fetch(
        `http://191.52.6.89:5000/editar_cliente/${cliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg =
          data?.detalhes || data?.message || "Erro ao editar cliente.";
        throw new Error(msg);
      }

      alert("Cliente atualizado com sucesso!");
      onSalvar?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao editar cliente.");
    }
  }

  return (
    // ✅ Modal/Popup, não página
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Editar Cliente</h2>
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
              <label className={styles.label}>Nome</label>
              <input
                name="nome"
                className={styles.input}
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tipo */}
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="fisico"
                  checked={form.tipo === "fisico"}
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
                  checked={form.tipo === "juridico"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                Jurídico
              </label>
            </div>

            {/* Sexo (PF) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Sexo</label>
              <select
                name="sexo"
                className={styles.input}
                value={form.sexo}
                onChange={handleChange}
                disabled={form.tipo !== "fisico"}
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {/* CPF / CNPJ */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>CPF</label>
                <input
                  name="cpf"
                  className={styles.input}
                  value={form.cpf}
                  onChange={handleChange}
                  disabled={form.tipo !== "fisico"}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>CNPJ</label>
                <input
                  name="cnpj"
                  className={styles.input}
                  value={form.cnpj}
                  onChange={handleChange}
                  disabled={form.tipo !== "juridico"}
                />
              </div>
            </div>

            {/* RG (PF) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>RG</label>
              <input
                name="rg"
                className={styles.input}
                value={form.rg}
                onChange={handleChange}
                disabled={form.tipo !== "fisico"}
              />
            </div>

            {/* Email / Telefone */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  name="email"
                  type="email"
                  className={styles.input}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Telefone</label>
                <input
                  name="telefone"
                  className={styles.input}
                  value={form.telefone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Data de nascimento (PF) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Data de nascimento</label>
              <input
                name="dataNasc"
                className={styles.inputDate}
                type="date"
                value={form.dataNasc}
                onChange={handleChange}
                disabled={form.tipo !== "fisico"}
              />
            </div>

            {/* Endereço */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>CEP</label>
                <input
                  name="endCep"
                  className={styles.input}
                  value={form.endCep}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Número</label>
                <input
                  name="endNumero"
                  className={styles.input}
                  value={form.endNumero}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>UF</label>
                <input
                  name="endUF"
                  className={styles.input}
                  maxLength={2}
                  value={form.endUF}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Município</label>
                <input
                  name="endMunicipio"
                  className={styles.input}
                  value={form.endMunicipio}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bairro</label>
                <input
                  name="endBairro"
                  className={styles.input}
                  value={form.endBairro}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Rua</label>
                <input
                  name="endRua"
                  className={styles.input}
                  value={form.endRua}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Complemento</label>
              <input
                name="endComplemento"
                className={styles.input}
                value={form.endComplemento}
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
