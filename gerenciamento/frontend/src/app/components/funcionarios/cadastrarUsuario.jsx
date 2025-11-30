"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarUsuario.module.css";

export default function CadastrarUsuario() {
  const [funcionariosLista, setFuncionariosLista] = useState([]);
  const [funcionarioId, setFuncionarioId] = useState("");
  const [form, setForm] = useState({ usuario: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_funcionarios");
      const data = await res.json();
      const lista = data.map((f) => ({
        id: f[0],
        nome: f[1],
        cpf: f[2].replace(/\D/g, ""),
      }));
      setFuncionariosLista(lista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFuncionarioChange = (e) => {
    const id = e.target.value;
    setFuncionarioId(id);
    const funcionario = funcionariosLista.find((f) => f.id.toString() === id);
    if (funcionario) {
      const [nome, sobrenome] = funcionario.nome.split(" ");
      setForm({
        usuario: `${nome.toLowerCase()}.${(sobrenome || "").toLowerCase()}`,
        senha: funcionario.cpf.substring(0, 6),
      });
    } else {
      setForm({ usuario: "", senha: "" });
    }
  };

  const handleSubmit = async () => {
    if (!funcionarioId || !form.usuario || !form.senha) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        funcionario_id: parseInt(funcionarioId),
        usuario: form.usuario,
        senha: form.senha,
      };
      const res = await fetch("http://localhost:5000/cadastrar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar usuário");
      alert("Usuário cadastrado com sucesso!");
      setForm({ usuario: "", senha: "" });
      setFuncionarioId("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Cadastrar Usuário do Sistema</h2>

      <label>Funcionário</label>
      <select value={funcionarioId} onChange={handleFuncionarioChange}>
        <option value="">Selecione um funcionário</option>
        {funcionariosLista.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nome} (CPF: {f.cpf})
          </option>
        ))}
      </select>

      <label>Usuário</label>
      <input type="text" value={form.usuario} readOnly />

      <label>Senha</label>
      <input type="text" value={form.senha} readOnly />

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <button
        className={styles.submit}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
    </div>
  );
}
