"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/loginPopup.module.css";

export default function RegisterPopup({ fechar, irParaLogin }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "fisico",
    sexo: "masculino",
    cpf: "",
    cnpj: "",
    rg: "",
    email: "",
    telefone: "",
    dataNasc: "",
    endCep: "",
    endRua: "",
    endNumero: "",
    endBairro: "",
    endComplemento: "",
    endUF: "",
    endMunicipio: "",
    usuario: "",
    senha: "",
    confirmarSenha: "",
  });

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (form.tipo === "fisico" && !form.cpf) {
      alert("CPF é obrigatório para pessoa física!");
      return;
    }

    if (form.tipo === "juridico" && !form.cnpj) {
      alert("CNPJ é obrigatório para pessoa jurídica!");
      return;
    }

    console.log("Dados enviados:", form);
    alert("Conta registrada com sucesso!");
  };

  return (
    <div className={styles.popupFundo}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={fechar}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className={styles.titulo}>Criar Conta</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome completo"
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            required
          />

          <select
            value={form.tipo}
            onChange={(e) => atualizar("tipo", e.target.value)}
          >
            <option value="fisico">Pessoa Física</option>
            <option value="juridico">Pessoa Jurídica</option>
          </select>

          {form.tipo === "fisico" ? (
            <input
              type="text"
              placeholder="CPF"
              value={form.cpf}
              onChange={(e) => atualizar("cpf", e.target.value)}
              required
            />
          ) : (
            <input
              type="text"
              placeholder="CNPJ"
              value={form.cnpj}
              onChange={(e) => atualizar("cnpj", e.target.value)}
              required
            />
          )}

          <input
            type="text"
            placeholder="RG"
            value={form.rg}
            onChange={(e) => atualizar("rg", e.target.value)}
          />

          <select
            value={form.sexo}
            onChange={(e) => atualizar("sexo", e.target.value)}
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => atualizar("email", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => atualizar("telefone", e.target.value)}
            required
          />

          <input
            type="date"
            value={form.dataNasc}
            onChange={(e) => atualizar("dataNasc", e.target.value)}
          />

          <input
            type="text"
            placeholder="CEP"
            value={form.endCep}
            onChange={(e) => atualizar("endCep", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Rua"
            value={form.endRua}
            onChange={(e) => atualizar("endRua", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Número"
            value={form.endNumero}
            onChange={(e) => atualizar("endNumero", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Bairro"
            value={form.endBairro}
            onChange={(e) => atualizar("endBairro", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Complemento"
            value={form.endComplemento}
            onChange={(e) => atualizar("endComplemento", e.target.value)}
          />

          <input
            type="text"
            placeholder="UF (ex: SP)"
            maxLength={2}
            value={form.endUF}
            onChange={(e) => atualizar("endUF", e.target.value.toUpperCase())}
            required
          />

          <input
            type="text"
            placeholder="Município"
            value={form.endMunicipio}
            onChange={(e) => atualizar("endMunicipio", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Nome de usuário"
            value={form.usuario}
            onChange={(e) => atualizar("usuario", e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={form.senha}
            onChange={(e) => atualizar("senha", e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={form.confirmarSenha}
            onChange={(e) => atualizar("confirmarSenha", e.target.value)}
            required
          />

          <button className={styles.btn} type="submit">
            Registrar
          </button>
        </form>

        <p className={styles.registerText}>
          Já tem uma conta?{" "}
          <span
            className={styles.registerLink}
            onClick={() => {
              if (typeof irParaLogin === "function") irParaLogin();
              fechar();
            }}
          >
            Faça login
          </span>
        </p>
      </div>
    </div>
  );
}
