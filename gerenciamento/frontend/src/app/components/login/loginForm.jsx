"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/login.module.css";

export default function LoginForm() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://192.168.18.155:5000/login_sistema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setErro(true);
          return;
        }

        const { token, usuario_sistema, funcionario, perfil } = json;

        // salvar token JWT
        if (token) localStorage.setItem("token", token);

        // salvar usuário do sistema
        if (usuario_sistema)
          localStorage.setItem(
            "usuario_sistema",
            JSON.stringify(usuario_sistema)
          );

        // salvar dados do funcionário
        if (funcionario)
          localStorage.setItem("funcionario", JSON.stringify(funcionario));

        // salvar perfil do usuário
        if (perfil) localStorage.setItem("perfil", JSON.stringify(perfil));

        // aplicar tema do usuário
        try {
          const tema =
            usuario_sistema.tema_preferido ||
            localStorage.getItem("tema_preferido");
          if (tema) {
            document.body.setAttribute(
              "data-theme",
              tema === "escuro" ? "dark" : "light"
            );
            localStorage.setItem("tema", tema);
          }
        } catch (err) {
          console.error("Erro ao aplicar tema:", err);
        }

        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Erro no login:", err);
        setErro(true);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.tituloSecundario}>BellaDonna Gestão</h2>
      <h1 className={styles.tituloPrincipal}>Faça Login</h1>

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              if (erro) setErro(false);
            }}
            className={`${styles.input} ${erro ? styles.inputErro : ""}`}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              if (erro) setErro(false);
            }}
            className={`${styles.input} ${erro ? styles.inputErro : ""}`}
          />
          <button
            type="button"
            className={styles.iconeOlho}
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            <FontAwesomeIcon icon={mostrarSenha ? faEyeSlash : faEye} />
          </button>
        </div>

        {erro && <p className={styles.erro}>Usuário e/ou senha inválidos</p>}

        <button type="submit" className={styles.botao}>
          Entrar
        </button>
      </form>
    </div>
  );
}
