// components/EnderecoForm.js
"use client";
import { useEffect, useState } from "react";
import styles from "../styles/perfil.module.css";

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://191.52.6.89:5000";

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

// Mapeia uma linha de cliente (objeto ou array) para os campos de endereço
function mapClienteEndereco(row) {
  if (!row) return null;

  // schema clientes (índices quando vier como array):
  // 0:id 1:dataCadastro 2:nome 3:tipo 4:sexo 5:cpf 6:cnpj 7:rg 8:email 9:telefone
  // 10:dataNasc 11:estado 12:endCep 13:endRua 14:endNumero 15:endBairro
  // 16:endComplemento 17:endUF 18:endMunicipio

  if (Array.isArray(row)) {
    return {
      cep: row[12] || "",
      logradouro: row[13] || "",
      numero: row[14] || "",
      bairro: row[15] || "",
      complemento: row[16] || "",
      uf: row[17] || "",
      cidade: row[18] || "",
    };
  }
  // DictCursor
  return {
    cep: row.endCep || "",
    logradouro: row.endRua || "",
    numero: row.endNumero || "",
    bairro: row.endBairro || "",
    complemento: row.endComplemento || "",
    uf: row.endUF || "",
    cidade: row.endMunicipio || "",
  };
}

export default function EnderecoForm() {
  const [clienteId, setClienteId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  const [form, setForm] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    complemento: "",
    cidade: "",
    uf: "",
  });

  // Descobre o cliente_id
  useEffect(() => {
    setClienteId(getClienteIdFromStorage());
  }, []);

  // Carrega endereço do backend
  useEffect(() => {
    (async () => {
      if (!clienteId) {
        setCarregando(false);
        return;
      }
      setCarregando(true);
      setErro(null);
      setOkMsg(null);

      try {
        // Como não há GET /cliente/:id, usamos /listar_clientes e filtramos
        const r = await fetch(`${BASE}/listar_clientes`, { cache: "no-store" });
        if (!r.ok) throw new Error("Falha ao listar clientes");
        const data = await r.json();
        const lista = Array.isArray(data) ? data : data?.detalhes || [];

        const row = lista.find((it) => {
          if (!it) return false;
          if (Array.isArray(it)) return Number(it[0]) === Number(clienteId);
          return Number(it.id) === Number(clienteId);
        });

        if (!row) {
          setCarregando(false);
          return;
        }

        const addr = mapClienteEndereco(row);
        setForm((prev) => ({ ...prev, ...addr }));
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar seu endereço.");
      } finally {
        setCarregando(false);
      }
    })();
  }, [clienteId]);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setOkMsg(null);

    if (!clienteId) {
      setErro("Identificação do cliente não encontrada.");
      return;
    }

    try {
      // Nomes exatamente como sua rota /editar_cliente/<id> espera
      const payload = {
        cep: form.cep || null,
        logradouro: form.logradouro || null,
        numero: form.numero || null,
        bairro: form.bairro || null,
        complemento: form.complemento || null,
        uf: form.uf || null,
        cidade: form.cidade || null,
      };

      const r = await fetch(`${BASE}/editar_cliente/${clienteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resp = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(
          resp?.detalhes || resp?.message || "Falha ao salvar endereço."
        );
      }

      setOkMsg("Endereço atualizado com sucesso!");
    } catch (e) {
      console.error(e);
      setErro(e.message || "Erro ao atualizar endereço.");
    }
  };

  return (
    <div className={styles.perfilForm}>
      <h2>Endereço</h2>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Linha 1 - CEP e Rua */}
          <div className={styles.row}>
            <div className={styles.col}>
              <label>CEP</label>
              <input
                type="text"
                placeholder="00000-000"
                value={form.cep}
                onChange={(e) => handleChange("cep", e.target.value)}
              />
            </div>

            <div className={styles.col}>
              <label>Rua</label>
              <input
                type="text"
                placeholder="Sua rua"
                value={form.logradouro}
                onChange={(e) => handleChange("logradouro", e.target.value)}
              />
            </div>
          </div>

          {/* Linha 2 - Número e Bairro */}
          <div className={styles.row}>
            <div className={styles.col}>
              <label>Número</label>
              <input
                type="text"
                placeholder="000"
                value={form.numero}
                onChange={(e) => handleChange("numero", e.target.value)}
              />
            </div>

            <div className={styles.col}>
              <label>Bairro</label>
              <input
                type="text"
                placeholder="Bairro"
                value={form.bairro}
                onChange={(e) => handleChange("bairro", e.target.value)}
              />
            </div>
          </div>

          {/* Linha 3 - Cidade e Estado */}
          <div className={styles.row}>
            <div className={styles.col}>
              <label>Cidade</label>
              <input
                type="text"
                placeholder="Cidade"
                value={form.cidade}
                onChange={(e) => handleChange("cidade", e.target.value)}
              />
            </div>

            <div className={styles.col}>
              <label>Estado</label>
              <select
                value={form.uf}
                onChange={(e) => handleChange("uf", e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </div>
          </div>

          {/* Complemento opcional */}
          <div className={styles.row}>
            <div className={styles.col}>
              <label>Complemento</label>
              <input
                type="text"
                placeholder="Apto / Bloco / Referência"
                value={form.complemento}
                onChange={(e) => handleChange("complemento", e.target.value)}
              />
            </div>
            <div className={styles.col} />
          </div>

          <button type="submit">Salvar Endereço</button>

          {okMsg && <p className={styles.okMsg}>{okMsg}</p>}
          {erro && <p className={styles.errMsg}>{erro}</p>}
        </form>
      )}
    </div>
  );
}
