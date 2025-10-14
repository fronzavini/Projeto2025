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
    if (usuario === "admin" && senha === "1234") {
      localStorage.setItem("token", "meu-token-exemplo");
      window.location.href = "/";
    } else {
      setErro(true);
    }
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
            onChange={(e) => setUsuario(e.target.value)}
            className={`${styles.input} ${erro ? styles.inputErro : ""}`}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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
