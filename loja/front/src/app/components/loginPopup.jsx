"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/loginPopup.module.css";

export default function LoginPopup({ fechar }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Dados de Login:", { email, password });
    alert(`Tentativa de Login com Email: ${email}`);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {/* Botão X */}
        <button className={styles.closeBtn} onClick={fechar}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.loginContainer}>
          <h2 className={styles.title}>Acesse sua conta</h2>

          {/* Formulário */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha:
              </label>

              <div className={styles.passwordWrapper}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />

                {/* Botão de mostrar senha */}
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  <FontAwesomeIcon icon={mostrarSenha ? faEyeSlash : faEye} />
                </button>
              </div>

              <span className={styles.forgotPassword}>Esqueceu sua senha?</span>
            </div>

            <button type="submit" className={styles.submitButton}>
              Entrar
            </button>
          </form>

          {/* Divisor */}
          <div className={styles.divider}>
            <hr className={styles.hr} />
            <span className={styles.orText}>ou</span>
            <hr className={styles.hr} />
          </div>

          {/* Login Google */}
          <button
            type="button"
            className={`${styles.socialButton} ${styles.googleButton}`}
          >
            Login com Google
          </button>

          {/* Registro */}
          <p className={styles.registerText}>
            Ainda não tem uma conta?{" "}
            <a href="/register" className={styles.registerLink}>
              Registre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
