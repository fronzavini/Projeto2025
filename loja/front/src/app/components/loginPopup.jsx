"use client";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/loginPopup.module.css";

export default function LoginPopup({ fechar, irParaRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const resp = await fetch("http://191.52.6.89:5000/login_loja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const dados = await resp.json();

      if (dados.resultado === "erro") {
        alert(dados.detalhes);
        setCarregando(false);
        return;
      }

      // Salvar token no localStorage
      localStorage.setItem("token_loja", dados.token);
      localStorage.setItem("usuario_loja", JSON.stringify(dados.usuario));

      alert("Login realizado com sucesso!");

      fechar && fechar();
      
      window.location.reload();


    } catch (error) {
      console.error("Erro ao tentar login:", error);
      alert("Erro ao conectar ao servidor.");
    }

    setCarregando(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={fechar}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.loginContainer}>
          <h2 className={styles.title}>Acesse sua conta</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email:</label>
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
              <label htmlFor="password" className={styles.label}>Senha:</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
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
                console.log("LOGIN GOOGLE SUCESSO:", credenciais);
                alert("Login com Google realizado!");
              }}
              onError={() => {
                console.log("Erro no login com Google");
                alert("Erro no Google Login.");
              }}
            />
          </div>

          <p className={styles.registerText}>
            Ainda não tem uma conta?{" "}
            <span
              className={styles.registerLink}
              onClick={() => irParaRegister && irParaRegister()}
            >
              Registre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
