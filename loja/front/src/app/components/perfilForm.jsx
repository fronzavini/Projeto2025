// components/PerfilForm.js
"use client";
import { useState, useEffect } from "react";
import styles from "../styles/perfil.module.css";

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://192.168.18.155:5000";

function getClienteIdFromStorage() {
  try {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem("usuario_loja")
        : null;
    const obj = raw ? JSON.parse(raw) : null;
    return obj?.cliente_id || obj?.id || null;
  } catch {
    return null;
  }
}

/** --- Datas (SEM usar new Date) --- */
function normalizeDateToInput(value) {
  if (!value) return "";
  const s = String(value).trim();
  if (!s || s === "0000-00-00") return "";

  // yyyy-mm-dd (com ou sem hora)
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  // yyyy/mm/dd
  m = s.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  // dd/mm/yyyy
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  // yyyy-mm-dd hh:mm:ss
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})\s+\d{2}:\d{2}:\d{2}$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  return "";
}

function ensureDate(value) {
  const ymd = normalizeDateToInput(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(ymd) ? ymd : null;
}

/** --- Helpers de mapeamento --- */
const readField = (row, idxOrName) =>
  Array.isArray(row) ? row[idxOrName] : row?.[idxOrName];

function findDateLikeInArray(arr) {
  if (!Array.isArray(arr)) return "";
  for (const v of arr) {
    const got = normalizeDateToInput(v);
    if (got) return got;
  }
  return "";
}

function mapClienteRow(row) {
  if (!row) return null;

  if (Array.isArray(row)) {
    // tenta posições prováveis e, se não achar, varre tudo
    const rawDate =
      readField(row, 10) ||
      readField(row, 11) ||
      readField(row, "data_nascimento") ||
      readField(row, "dataNascimento");
    const dataFmt = normalizeDateToInput(rawDate) || findDateLikeInArray(row);

    return {
      id: readField(row, 0),
      nome: readField(row, 2) || "",
      tipo: readField(row, 3) || "fisico",
      cpf: readField(row, 5) || "",
      rg: readField(row, 7) || "",
      email: readField(row, 8) || "",
      telefone: readField(row, 9) || "",
      dataNascimento: dataFmt,
    };
  }

  return {
    id: row.id,
    nome: row.nome || "",
    tipo: row.tipo || "fisico",
    cpf: row.cpf || "",
    rg: row.rg || "",
    email: row.email || "",
    telefone: row.telefone || "",
    dataNascimento: normalizeDateToInput(
      row.data_nascimento ||
        row.dataNascimento ||
        row.dataNasc ||
        row.dt_nasc ||
        ""
    ),
  };
}

export default function PerfilForm({ usuario }) {
  const [clienteId, setClienteId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    tipo: "fisico",
    cpf: "",
    rg: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  useEffect(() => {
    const id = getClienteIdFromStorage();
    setClienteId(id || usuario?.cliente_id || usuario?.id || null);
  }, [usuario]);

  useEffect(() => {
    (async () => {
      setCarregando(true);
      setErro(null);
      setOkMsg(null);
      try {
        // 1) hidrata com props (inclui data)
        const mappedFromProps = usuario ? mapClienteRow(usuario) : null;
        if (mappedFromProps) {
          setForm((prev) => ({ ...prev, ...mappedFromProps }));
        }

        // 2) enriquece com backend
        const id = getClienteIdFromStorage() || clienteId;
        if (!id) {
          setCarregando(false);
          return;
        }

        const r = await fetch(`${BASE}/listar_clientes`, { cache: "no-store" });
        if (!r.ok) throw new Error("Falha ao listar clientes");
        const payload = await r.json();
        const lista = Array.isArray(payload)
          ? payload
          : payload?.detalhes || [];

        const row = lista.find((it) => {
          if (!it) return false;
          if (Array.isArray(it)) return Number(it[0]) === Number(id);
          return Number(it.id) === Number(id);
        });
        if (!row) {
          setCarregando(false);
          return;
        }

        const mapped = mapClienteRow(row);
        setForm((prev) => ({
          ...prev,
          nome: mapped.nome || prev.nome,
          tipo: mapped.tipo || prev.tipo,
          cpf: mapped.cpf || prev.cpf,
          rg: mapped.rg || prev.rg,
          email: mapped.email || prev.email,
          telefone: mapped.telefone || prev.telefone,
          // só substitui se achou data válida
          dataNascimento: mapped.dataNascimento || prev.dataNascimento,
        }));
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar seus dados.");
      } finally {
        setCarregando(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  const handleChange = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  async function atualizarPerfil() {
    const dn = form.tipo === "fisico" ? ensureDate(form.dataNascimento) : null;

    const payload = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      cpf: form.tipo === "fisico" ? form.cpf : null,
      rg: form.tipo === "fisico" ? form.rg : null,
      // envia nos dois formatos para compatibilidade
      data_nascimento: dn,
      dataNascimento: dn,
    };

    const r = await fetch(`${BASE}/editar_cliente/${clienteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resp = await r.json().catch(() => ({}));
    if (!r.ok) {
      throw new Error(
        resp?.detalhes || resp?.message || "Falha ao salvar alterações."
      );
    }
  }

  async function alterarSenhaSeNecessario() {
    const { senhaAtual, novaSenha, confirmarSenha } = form;
    if (!senhaAtual && !novaSenha && !confirmarSenha) return;
    if (!senhaAtual || !novaSenha || !confirmarSenha)
      throw new Error("Preencha senha atual, nova senha e confirmação.");
    if (novaSenha !== confirmarSenha)
      throw new Error("As senhas não conferem.");
    if (novaSenha.length < 8)
      throw new Error("A nova senha deve ter pelo menos 8 caracteres.");

    const body = { senha_atual: senhaAtual, senha_nova: novaSenha };
    const r = await fetch(`${BASE}/alterar_senha/${clienteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(j?.detalhes || "Erro ao alterar senha.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setOkMsg(null);

    if (!clienteId) {
      setErro("Identificação do cliente não encontrada.");
      return;
    }

    try {
      await atualizarPerfil();
      await alterarSenhaSeNecessario();
      setForm((p) => ({
        ...p,
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      }));
      setOkMsg("Informações atualizadas com sucesso!");
    } catch (e) {
      console.error(e);
      setErro(e.message || "Erro ao atualizar dados.");
    }
  };

  return (
    <div className={styles.perfilForm}>
      <h2>Meus Dados</h2>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.col}>
              <label>Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />
            </div>
            <div className={styles.col}>
              <label>Tipo de Pessoa</label>
              <select
                value={form.tipo}
                onChange={(e) => handleChange("tipo", e.target.value)}
              >
                <option value="fisico">Pessoa Física</option>
                <option value="juridico">Pessoa Jurídica</option>
              </select>
            </div>
          </div>

          {form.tipo === "fisico" && (
            <>
              <div className={styles.row}>
                <div className={styles.col}>
                  <label>CPF</label>
                  <input
                    type="text"
                    value={form.cpf}
                    onChange={(e) => handleChange("cpf", e.target.value)}
                  />
                </div>
                <div className={styles.col}>
                  <label>RG</label>
                  <input
                    type="text"
                    value={form.rg}
                    onChange={(e) => handleChange("rg", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label>Data de Nascimento</label>
                  <input
                    type="date"
                    value={form.dataNascimento}
                    onChange={(e) =>
                      handleChange("dataNascimento", e.target.value)
                    }
                  />
                </div>
                <div className={styles.col} />
              </div>
            </>
          )}

          <div className={styles.row}>
            <div className={styles.col}>
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className={styles.col}>
              <label>Telefone</label>
              <input
                type="text"
                value={form.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
              />
            </div>
          </div>

          {/* Senhas (sem botão de mostrar) */}
          <div className={styles.row}>
            <div className={styles.col}>
              <label>Senha Atual</label>
              <input
                type="password"
                value={form.senhaAtual}
                onChange={(e) => handleChange("senhaAtual", e.target.value)}
              />
            </div>
            <div className={styles.col}>
              <label>Nova Senha</label>
              <input
                type="password"
                value={form.novaSenha}
                onChange={(e) => handleChange("novaSenha", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <label>Confirmar Nova Senha</label>
              <input
                type="password"
                value={form.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
              />
            </div>
            <div className={styles.col} />
          </div>

          <button type="submit">Salvar</button>

          {okMsg && <p className={styles.okMsg}>{okMsg}</p>}
          {erro && <p className={styles.errMsg}>{erro}</p>}
        </form>
      )}
    </div>
  );
}
