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

  // Pega o usuário logado do localStorage
  useEffect(() => {
    const usuarioLS = JSON.parse(localStorage.getItem("usuario_sistema"));
    if (usuarioLS) {
      setUsuario(usuarioLS);
      setNovoUsuario(usuarioLS.usuario); // preenche o campo do usuário
    }
  }, []);

  const handleAtualizar = async () => {
    setErrorMsg(null);

    if (!novoUsuario) {
      setErrorMsg("O nome de usuário não pode ficar vazio.");
      return;
    }

    // validação se o usuário quer alterar a senha
    const alterarSenha = senhaAntiga || novaSenha || confirmNovaSenha;
    if (alterarSenha) {
      if (!senhaAntiga || !novaSenha || !confirmNovaSenha) {
        setErrorMsg("Preencha todos os campos de senha para alterar.");
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
        `http://localhost:5000/atualizar_usuario/${usuario.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: novoUsuario,
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

      // atualiza localStorage
      const usuarioAtualizado = { ...usuario, usuario: novoUsuario };
      if (alterarSenha) usuarioAtualizado.senha = novaSenha;
      localStorage.setItem(
        "usuario_sistema",
        JSON.stringify(usuarioAtualizado)
      );
      setUsuario(usuarioAtualizado);

      // limpa campos de senha
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

  if (!usuario) return null; // ainda carregando

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
        placeholder="Digite sua senha atual (para alterar)"
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
        className={`${styles.submit}`}
        onClick={handleAtualizar}
        disabled={loading}
      >
        {loading ? "Atualizando..." : "Atualizar Usuário"}
      </button>
    </div>
  );
}
