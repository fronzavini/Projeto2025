"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/editarUsuario.module.css";

export default function EditarUsuario({ onAtualizado }) {
  const [usuario, setUsuario] = useState(null);

  const [novoUsuario, setNovoUsuario] = useState("");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmNovaSenha, setConfirmNovaSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carrega usuário logado
  useEffect(() => {
    const usuarioLS = JSON.parse(localStorage.getItem("usuario_sistema"));
    if (usuarioLS) {
      setUsuario(usuarioLS);
      setNovoUsuario(usuarioLS.usuario);
    }
  }, []);

  const handleAtualizar = async () => {
    setErrorMsg(null);

    const alterarUsuario = novoUsuario && novoUsuario !== usuario.usuario;
    const alterarSenha = senhaAntiga || novaSenha || confirmNovaSenha;

    // Validação: precisa alterar pelo menos um
    if (!alterarUsuario && !alterarSenha) {
      setErrorMsg("Altere o nome de usuário e/ou a senha para atualizar.");
      return;
    }

    // Se for alterar senha, valida todos os campos de senha
    if (alterarSenha) {
      if (!senhaAntiga || !novaSenha || !confirmNovaSenha) {
        setErrorMsg("Para alterar a senha, preencha todos os campos de senha.");
        return;
      }
      if (novaSenha !== confirmNovaSenha) {
        setErrorMsg("A nova senha e a confirmação não coincidem.");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000('/editar_usuario_sistema/${usuario.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: alterarUsuario ? novoUsuario : undefined,
            senhaAntiga: alterarSenha ? senhaAntiga : undefined,
            novaSenha: alterarSenha ? novaSenha : undefined,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao atualizar usuário.");
      }

      alert("Usuário atualizado com sucesso!");

      // Atualiza localStorage
      const usuarioAtualizado = { ...usuario };
      if (alterarUsuario) usuarioAtualizado.usuario = novoUsuario;
      if (alterarSenha) usuarioAtualizado.senha = novaSenha;

      localStorage.setItem(
        "usuario_sistema",
        JSON.stringify(usuarioAtualizado)
      );
      setUsuario(usuarioAtualizado);

      // Limpa campos de senha
      setSenhaAntiga("");
      setNovaSenha("");
      setConfirmNovaSenha("");

      if (onAtualizado) onAtualizado();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return null; // carregando

  return (
    <div className={styles.container}>
      <h2>Editar Usuário</h2>

      <label>Nome de Usuário</label>
      <input
        type="text"
        value={novoUsuario}
        onChange={(e) => setNovoUsuario(e.target.value)}
        placeholder="Digite seu nome de usuário"
      />

      <hr />

      <label>Senha Antiga</label>
      <input
        type="password"
        value={senhaAntiga}
        onChange={(e) => setSenhaAntiga(e.target.value)}
        placeholder="Digite sua senha atual (para alterar senha)"
      />

      <label>Nova Senha</label>
      <input
        type="password"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
        placeholder="Digite a nova senha"
      />

      <label>Confirmar Nova Senha</label>
      <input
        type="password"
        value={confirmNovaSenha}
        onChange={(e) => setConfirmNovaSenha(e.target.value)}
        placeholder="Repita a nova senha"
      />

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <button
        className={styles.submit}
        onClick={handleAtualizar}
        disabled={loading}
      >
        {loading ? "Atualizando..." : "Atualizar Usuário"}
      </button>
    </div>
  );
}
