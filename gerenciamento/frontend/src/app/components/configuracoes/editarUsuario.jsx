"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/editarUsuario.module.css";

export default function EditarUsuario({ onAtualizado }) {
  const [usuario, setUsuario] = useState(null);

  const [novoUsuario, setNovoUsuario] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
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
    const alterarSenha = novaSenha || confirmNovaSenha;

    // Validação: sempre precisa da senha atual
    if (!senhaAtual) {
      setErrorMsg("Digite sua senha atual para confirmar a atualização.");
      return;
    }

    // Se for alterar senha, valida novos campos
    if (alterarSenha) {
      if (!novaSenha || !confirmNovaSenha) {
        setErrorMsg(
          "Para alterar a senha, preencha todos os campos de nova senha.",
        );
        return;
      }
      if (novaSenha !== confirmNovaSenha) {
        setErrorMsg("A nova senha e a confirmação não coincidem.");
        return;
      }
    }

    if (!alterarUsuario && !alterarSenha) {
      setErrorMsg("Altere o nome de usuário e/ou a senha para atualizar.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://192.168.18.155:5000/editar_usuario_sistema/${usuario.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: alterarUsuario ? novoUsuario : undefined,
            senhaAtual,
            novaSenha: alterarSenha ? novaSenha : undefined,
          }),
        },
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
        JSON.stringify(usuarioAtualizado),
      );
      setUsuario(usuarioAtualizado);

      // Limpa campos de senha
      setSenhaAtual("");
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

      <label>Senha Atual</label>
      <input
        type="password"
        value={senhaAtual}
        onChange={(e) => setSenhaAtual(e.target.value)}
        placeholder="Digite sua senha atual"
      />

      <label>Nova Senha</label>
      <input
        type="password"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
        placeholder="Digite a nova senha (opcional)"
      />

      <label>Confirmar Nova Senha</label>
      <input
        type="password"
        value={confirmNovaSenha}
        onChange={(e) => setConfirmNovaSenha(e.target.value)}
        placeholder="Repita a nova senha (opcional)"
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
