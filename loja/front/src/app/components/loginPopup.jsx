// src/app/components/loginPopup.jsx
"use client";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/loginPopup.module.css";

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://192.168.18.155:5000";

export default function LoginPopup({ fechar, irParaRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);

  function salvarSessaoEFechar(dados) {
    // Esperado: { resultado: "ok", token, usuario }
    try {
      localStorage.setItem("token_loja", dados.token);
      localStorage.setItem("usuario_loja", JSON.stringify(dados.usuario));
    } catch {}
    alert("Login realizado com sucesso!");
    if (fechar) fechar();
    if (typeof window !== "undefined") window.location.reload();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (carregando || carregandoGoogle) return;
    setCarregando(true);
    try {
      const resp = await fetch(`${BASE}/login_loja`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const dados = await resp.json().catch(() => null);

      if (!resp.ok || !dados || dados.resultado === "erro") {
        const msg =
          dados?.detalhes ||
          dados?.erro ||
          "Não foi possível realizar o login.";
        alert(msg);
        setCarregando(false);
        return;
      }
      salvarSessaoEFechar(dados);
    } catch (error) {
      console.error("Erro ao tentar login:", error);
      alert("Erro ao conectar ao servidor.");
      setCarregando(false);
    }
  }

  async function handleGoogleSuccess(credenciais) {
    try {
      setCarregandoGoogle(true);
      const id_token =
        credenciais?.credential || credenciais?.idToken || credenciais?.tokenId;

      if (!id_token) {
        alert("Token do Google ausente.");
        setCarregandoGoogle(false);
        return;
      }

      const resp = await fetch(`${BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token }),
      });

      const dados = await resp.json().catch(() => null);

      if (!resp.ok || !dados || dados.resultado !== "ok") {
        const msg =
          dados?.detalhes || dados?.erro || "Falha ao autenticar com o Google.";
        alert(msg);
        setCarregandoGoogle(false);
        return;
      }

      salvarSessaoEFechar(dados);
    } catch (e) {
      console.error("Erro no login Google:", e);
      alert("Erro ao processar login com Google.");
      setCarregandoGoogle(false);
    }
  }

  function handleGoogleError(err) {
    const msg = String(err?.message || err || "");
    if (msg.includes("AbortError") || msg.includes("popup_closed_by_user")) {
      return; // silêncio para fechar popup
    }
    console.error("GoogleLogin error:", err);
    alert("Erro no Google Login.");
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button
          className={styles.closeBtn}
          onClick={fechar}
          aria-label="Fechar"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.loginContainer}>
          <h2 className={styles.title}>Acesse sua conta</h2>

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
                autoComplete="email"
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  <FontAwesomeIcon icon={mostrarSenha ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={carregando || carregandoGoogle}
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
            {/* Certifique-se de envolver a app com <GoogleOAuthProvider clientId="..."> */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              ux_mode="popup"
            />
          </div>

          <p className={styles.registerText}>
            Ainda não tem uma conta?{" "}
            <span
              className={styles.registerLink}
              onClick={() => irParaRegister && irParaRegister()}
              role="button"
              tabIndex={0}
            >
              Registre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
