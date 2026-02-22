"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarUsuario.module.css";

export default function CadastrarUsuario() {
  const [funcionariosLista, setFuncionariosLista] = useState([]);
  const [funcionarioId, setFuncionarioId] = useState("");
  const [form, setForm] = useState({
    usuario: "",
    senha: "",
    tipo_usuario: "",
    tema_preferido: "claro",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://191.52.6.89:5000/listar_funcionarios");
        const data = await res.json();
        // backend devolve lista de tuplas -> [id, nome, cpf, ...]
        const lista = (data || []).map((f) => ({
          id: f[0],
          nome: f[1],
          cpf: String(f[2] || "").replace(/\D/g, ""),
        }));
        setFuncionariosLista(lista);
      } catch (err) {
        console.error(err);
        setFuncionariosLista([]);
      }
    })();
  }, []);

  const handleFuncionarioChange = (e) => {
    const id = e.target.value;
    setFuncionarioId(id);
    const funcionario = funcionariosLista.find((f) => String(f.id) === id);

    if (funcionario) {
      const partes = funcionario.nome.trim().split(/\s+/);
      const nome = (partes[0] || "").toLowerCase();
      const sobrenome = (partes[partes.length - 1] || "").toLowerCase();
      setForm((old) => ({
        ...old,
        usuario: `${nome}.${sobrenome}`.replace(/[^\w.]/g, ""),
        senha: funcionario.cpf.substring(0, 6) || "123456",
      }));
    } else {
      setForm((old) => ({ ...old, usuario: "", senha: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!funcionarioId || !form.usuario || !form.senha || !form.tipo_usuario) {
      alert("Selecione o funcionário e o tipo, e verifique usuário/senha.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        funcionario_id: parseInt(funcionarioId, 10),
        tipo_usuario: form.tipo_usuario, // 🔴 obrigatório no backend
        usuario: form.usuario,
        senha: form.senha,
        tema_preferido: form.tema_preferido, // opcional
      };

      const res = await fetch("http://191.52.6.89:5000/criar_usuario_sistema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.message || data?.detalhes || "Erro ao cadastrar usuário"
        );

      alert(data?.message || "Usuário cadastrado com sucesso!");
      setForm({
        usuario: "",
        senha: "",
        tipo_usuario: "",
        tema_preferido: "claro",
      });
      setFuncionarioId("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <label>Funcionário</label>
      <select value={funcionarioId} onChange={handleFuncionarioChange}>
        <option value="">Selecione um funcionário</option>
        {funcionariosLista.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nome} {f.cpf ? `(CPF: ${f.cpf})` : ""}
          </option>
        ))}
      </select>

      <label>Tipo de usuário</label>
      <select
        name="tipo_usuario"
        value={form.tipo_usuario}
        onChange={handleChange}
      >
        <option value="">Selecione</option>
        <option value="Administrador">Administrador</option>
        <option value="Vendedor">Vendedor</option>
        <option value="Estoque">Estoque</option>
      </select>

      <label>Usuário</label>
      <input
        type="text"
        value={form.usuario}
        onChange={(e) => setForm((o) => ({ ...o, usuario: e.target.value }))}
      />

      <label>Senha</label>
      <input
        type="text"
        value={form.senha}
        onChange={(e) => setForm((o) => ({ ...o, senha: e.target.value }))}
      />

      <label>Tema preferido</label>
      <select
        name="tema_preferido"
        value={form.tema_preferido}
        onChange={handleChange}
      >
        <option value="claro">claro</option>
        <option value="escuro">escuro</option>
      </select>

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
