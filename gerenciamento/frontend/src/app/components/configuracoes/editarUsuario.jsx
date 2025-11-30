"use client";

import { useState } from "react";
import styles from "../../styles/editarUsuario.module.css";

export default function EditarUsuario({ usuario, onAtualizado }) {
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmNovaSenha, setConfirmNovaSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAtualizar = async () => {
    setErrorMsg(null);

    // validação
    if (!senhaAntiga || !novaSenha || !confirmNovaSenha) {
      setErrorMsg("Preencha todos os campos.");
      return;
    }
    if (novaSenha !== confirmNovaSenha) {
      setErrorMsg("A nova senha e a confirmação não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/atualizar_usuario/${usuario.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senhaAntiga,
            novaSenha,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao atualizar usuário.");
      }

      alert("Usuário atualizado com sucesso!");
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

  return (
    <div className={styles.container}>
      <h2>Editar Usuário: {usuario.username}</h2>

      <label>Senha Antiga</label>
      <input
        type="password"
        value={senhaAntiga}
        onChange={(e) => setSenhaAntiga(e.target.value)}
        placeholder="Digite sua senha atual"
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
        {loading ? "Atualizando..." : "Atualizar Senha"}
      </button>
    </div>
  );
}
