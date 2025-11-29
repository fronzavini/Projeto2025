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

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //
      // 🔥 Agora envia “usuario” e “senha” conforme sua nova rota
      //
      body: JSON.stringify({ usuario, senha }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setErro(true);
          return;
        }

        // json agora contém { usuario_sistema, funcionario, settings }
        const { usuario_sistema, funcionario, settings } = json;

        // armazena o usuário logado (usuário do sistema)
        localStorage.setItem("usuario_sistema", JSON.stringify(usuario_sistema));

        // armazena os dados do funcionário vinculado
        if (funcionario)
          localStorage.setItem("funcionario", JSON.stringify(funcionario));

        // configurações do usuário
        if (settings)
          localStorage.setItem("settings", JSON.stringify(settings));

        try {
          const tema =
            (settings && settings.tema_preferido) ||
            localStorage.getItem("tema_preferido");

          if (tema) {
            document.body.setAttribute(
              "data-theme",
              tema === "escuro" ? "dark" : "light"
            );
            localStorage.setItem("tema_preferido", tema);
          }
        } catch (err) {
          console.error("Erro ao aplicar settings:", err);
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
            name="usuario"
            onChange={(e) => setUsuario(e.target.value)}
            className={`${styles.input} ${erro ? styles.inputErro : ""}`}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Digite sua senha"
            value={senha}
            name = "senha"
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
