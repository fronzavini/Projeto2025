"use client";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/loginPopup.module.css";

export default function RegisterPopup({ fechar, irParaLogin }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "fisico",
    sexo: "masculino",
    cpf: "",
    rg: "",
    cnpj: "",
    email: "",
    telefone: "",
    usuario: "",
    senha: "",
    confirmarSenha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // valida senha
    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    // valida CPF/CNPJ
    if (form.tipo === "fisico" && !form.cpf.trim()) {
      alert("CPF é obrigatório para pessoa física!");
      return;
    }
    if (form.tipo === "juridico" && !form.cnpj.trim()) {
      alert("CNPJ é obrigatório para pessoa jurídica!");
      return;
    }

    try {
      // ----------------------------
      // 1) CRIAR CLIENTE NO BANCO
      // ----------------------------
      const clienteResponse = await fetch("http://191.52.6.89:5000/criar_cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          tipo: form.tipo,
          email: form.email,
          telefone: form.telefone,
          cep: "00000000",        
          logradouro: "Não informado",
          numero: "S/N",
          bairro: "Não informado",
          complemento: "",
          uf: "SP",
          cidade: "Não informado",
          cpf: form.tipo === "fisico" ? form.cpf : null,
          rg: null,
          sexo: form.sexo,
          data_nascimento: null,
          cnpj: form.tipo === "juridico" ? form.cnpj : null,
        }),
      });

      const clienteData = await clienteResponse.json();

      if (!clienteResponse.ok || !clienteData.id) {
        console.log(clienteData);
        alert("Erro ao criar cliente.");
        return;
      }

      const cliente_id = clienteData.id;

      // ----------------------------
      // 2) CRIAR USUARIO_LOJA
      // ----------------------------
      const userResponse = await fetch("http://191.52.6.89:5000/criar_usuario_loja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id,
          usuario: form.usuario,
          senha: form.senha,
        }),
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        console.log(userData);
        alert("Cliente criado, mas erro ao vincular usuário!");
        return;
      }

      alert("Conta criada com sucesso!");
      if (irParaLogin) irParaLogin();
      fechar();
    } catch (erro) {
      console.error("Erro no registro:", erro);
      alert("Erro inesperado ao registrar a conta.");
    }
  }

  return (
    <div className={styles.overlay} onClick={fechar}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.closeBtn} onClick={fechar}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.loginContainer}>
          <h2 className={styles.title}>Criar Conta</h2>

          <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome completo:</label>
              <input
                type="text"
                className={styles.input}
                value={form.nome}
                onChange={(e) => atualizar("nome", e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo:</label>
              <select
                className={styles.input}
                value={form.tipo}
                onChange={(e) => atualizar("tipo", e.target.value)}
              >
                <option value="fisico">Pessoa Física</option>
                <option value="juridico">Pessoa Jurídica</option>
              </select>
            </div>

            {form.tipo === "fisico" ? (
              <div className={styles.inputGroup}>
                <label className={styles.label}>CPF:</label>
                <input
                  type="text"
                  className={styles.input}
                  value={form.cpf}
                  onChange={(e) => atualizar("cpf", e.target.value)}
                  required
                />
                <label className={styles.label}>RG:</label>
                <input
                  type="text"
                  className={styles.input}
                  value={form.rg}
                  onChange={(e) => atualizar("rg", e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <label className={styles.label}>CNPJ:</label>
                <input
                  type="text"
                  className={styles.input}
                  value={form.cnpj}
                  onChange={(e) => atualizar("cnpj", e.target.value)}
                  required
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email:</label>
              <input
                type="email"
                className={styles.input}
                value={form.email}
                onChange={(e) => atualizar("email", e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Telefone:</label>
              <input
                type="text"
                className={styles.input}
                value={form.telefone}
                onChange={(e) => atualizar("telefone", e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Usuário:</label>
              <input
                type="text"
                className={styles.input}
                value={form.usuario}
                onChange={(e) => atualizar("usuario", e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Senha:</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  className={styles.input}
                  value={form.senha}
                  onChange={(e) => atualizar("senha", e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  <FontAwesomeIcon icon={mostrarSenha ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Confirmar senha:</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  className={styles.input}
                  value={form.confirmarSenha}
                  onChange={(e) => atualizar("confirmarSenha", e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Registrar
            </button>
          </form>

          <div className={styles.divider}>
            <hr className={styles.hr} />
            <span className={styles.orText}>ou</span>
            <hr className={styles.hr} />
          </div>

          <div className={styles.googleWrapper}>
            <GoogleLogin
              onSuccess={(credenciais) => {
                console.log("Registro Google Sucesso:", credenciais);
                alert("Conta registrada com Google!");
              }}
              onError={() => {
                alert("Erro no registro com Google.");
              }}
            />
          </div>

          <p className={styles.registerText}>
            Já tem uma conta?{" "}
            <span
              className={styles.registerLink}
              onClick={() => {
                if (irParaLogin) irParaLogin();
              }}
            >
              Faça login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
