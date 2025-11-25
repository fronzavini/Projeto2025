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
    // Call backend login
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: usuario, senha }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          setErro(true);
          return;
        }
        // Successful login: json contains funcionario, settings, perfil
        const { funcionario, settings } = json;
        // store basic session info
        localStorage.setItem('user', JSON.stringify(funcionario));
        if (settings) localStorage.setItem('settings', JSON.stringify(settings));

        // apply theme immediately if present
        try {
          const tema = settings && settings.tema ? settings.tema : localStorage.getItem('tema');
          if (tema) {
            document.body.setAttribute('data-theme', tema === 'escuro' ? 'dark' : 'light');
            localStorage.setItem('tema', tema);
          }
          const idioma = settings && settings.idioma ? settings.idioma : localStorage.getItem('idioma');
          if (idioma) localStorage.setItem('idioma', idioma);
        } catch (err) {
          console.error('Erro ao aplicar settings:', err);
        }

        // redirect to home
        window.location.href = '/';
      })
      .catch((err) => {
        console.error('Erro no login:', err);
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
