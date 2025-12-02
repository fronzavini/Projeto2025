"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

function toISOFromBRDate(v) {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;       // já ISO
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v);
  if (!m) return v; // deixa como está (browser pode mandar ISO)
  const [, d, mo, y] = m;
  const dd = d.padStart(2, "0");
  const mm = mo.padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}
// Substitua a toNumberSafe antiga por esta
function toNumberSafe(v) {
  if (v === null || v === undefined || v === "") return null;
  const s = String(v).trim();

  // Caso tenha ponto e vírgula: assume milhar com ponto e decimal com vírgula (ex.: 1.234,56)
  if (s.includes(",") && s.includes(".")) {
    const semMilhar = s.replace(/\./g, ""); // tira pontos de milhar
    return Number(semMilhar.replace(",", ".")); // vírgula vira ponto decimal
  }

  // Só vírgula: decimal BR (ex.: 14,99)
  if (s.includes(",")) {
    return Number(s.replace(",", "."));
  }

  // Só ponto: decimal US (ex.: 15.00)
  return Number(s);
}

export default function EditarCupom({ cupomInicial, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [tiposProduto, setTiposProduto] = useState([]);

  const [showSugestoesProduto, setShowSugestoesProduto] = useState(false);
  const [showSugestoesTipo, setShowSugestoesTipo] = useState(false);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetch("http://191.52.6.89:5000/listar_produtos");
        if (!res.ok) throw new Error("Erro ao carregar produtos.");
        const data = await res.json();
        const produtosFormatados = Array.isArray(data)
          ? data.map((p) => ({ id: p[0], nome: p[1], categoria: p[2] }))
          : [];
        setProdutos(produtosFormatados);
        setTiposProduto([...new Set(produtosFormatados.map((p) => p.categoria))]);
      } catch (err) {
        console.error(err);
      }
    }
    carregarProdutos();
  }, []);

  // Mantemos o enum da base
  const tipoInicial = useMemo(() => {
    const t = (cupomInicial?.tipo || "").toLowerCase();
    if (["valor_fixo", "percentual", "frete"].includes(t)) return t;
    if (t === "valor") return "valor_fixo";
    return "valor_fixo";
  }, [cupomInicial]);

  const aplicacaoInicial = useMemo(() => {
    if (cupomInicial?.tipo_produto) return "tipo_produto";
    if (cupomInicial?.produto) return "produto";
    return "produto";
  }, [cupomInicial]);

  const [formData, setFormData] = useState({
    codigo: cupomInicial?.codigo ?? "",
    tipo: tipoInicial,
    descontofixo:
      tipoInicial === "valor_fixo"
        ? (cupomInicial?.descontoFixo ?? cupomInicial?.descontofixo ?? "")
        : "",
    descontoPorcentagem:
      tipoInicial === "percentual"
        ? (cupomInicial?.descontoPorcentagem ?? "")
        : "",
    descontofrete:
      tipoInicial === "frete"
        ? (cupomInicial?.descontoFrete ?? cupomInicial?.descontofrete ?? "")
        : "",
    validade: (cupomInicial?.validade && toISOFromBRDate(cupomInicial.validade)) || "",
    usos_permitidos:
      cupomInicial?.usosPermitidos ?? cupomInicial?.usos_permitidos ?? "",
    valor_minimo:
      cupomInicial?.valorMinimo ?? cupomInicial?.valor_minimo ?? "",

    aplicacao: aplicacaoInicial, // "produto" | "tipo_produto"
    produtoSelecionado: cupomInicial?.produto || "",
    tipo_produto: cupomInicial?.tipo_produto || "",
  });

  const produtosSugeridos = useMemo(() => {
    const q = (formData.produtoSelecionado || "").toLowerCase().trim();
    if (!q) return [];
    return produtos
      .filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          (p.categoria || "").toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [formData.produtoSelecionado, produtos]);

  const tiposSugeridos = useMemo(() => {
    const q = (formData.tipo_produto || "").toLowerCase().trim();
    if (!q) return [];
    return tiposProduto
      .filter((t) => (t || "").toLowerCase().includes(q))
      .slice(0, 10);
  }, [formData.tipo_produto, tiposProduto]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (name === "tipo") {
        if (value === "valor_fixo") {
          return {
            ...prev,
            tipo: "valor_fixo",
            descontofixo: prev.descontofixo || "",
            descontoPorcentagem: "",
            descontofrete: "",
          };
        }
        if (value === "percentual") {
          return {
            ...prev,
            tipo: "percentual",
            descontoPorcentagem: prev.descontoPorcentagem || "",
            descontofixo: "",
            descontofrete: "",
          };
        }
        return {
          ...prev,
          tipo: "frete",
          descontofrete: prev.descontofrete || "",
          descontofixo: "",
          descontoPorcentagem: "",
        };
      }

      if (name === "aplicacao") {
        setShowSugestoesProduto(false);
        setShowSugestoesTipo(false);
        return { ...prev, aplicacao: value };
      }

      return { ...prev, [name]: type === "number" ? String(value) : value };
    });
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setShowSugestoesProduto(false);
      setShowSugestoesTipo(false);
      e.currentTarget.blur?.();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Números normalizados (aceita vírgula)
    const descontoFixo = toNumberSafe(formData.descontofixo);
    const descontoPct = toNumberSafe(formData.descontoPorcentagem);
    const descontoFrete = toNumberSafe(formData.descontofrete);
    const usosPermitidos = parseInt(String(formData.usos_permitidos || "0"), 10) || 0;
    const valorMinimo = toNumberSafe(formData.valor_minimo) ?? 0;

    // Data ISO
    const validadeISO = toISOFromBRDate(formData.validade) || null;

    // tipo_produto: nome do produto OU categoria, conforme aplicação
    const tipoProdutoPayload =
      formData.aplicacao === "tipo_produto"
        ? String(formData.tipo_produto || "").trim()
        : String(formData.produtoSelecionado || "").trim();

    const payload = {
      codigo: String(formData.codigo || "").trim(),
      tipo: formData.tipo, // "valor_fixo" | "percentual" | "frete"
      descontofixo: formData.tipo === "valor_fixo" ? (descontoFixo ?? 0) : null,
      descontoPorcentagem: formData.tipo === "percentual" ? (descontoPct ?? 0) : null,
      descontofrete: formData.tipo === "frete" ? (descontoFrete ?? 0) : null,
      validade: validadeISO,
      usos_permitidos: usosPermitidos,
      valor_minimo: valorMinimo,

      aplicacao: formData.aplicacao,            // "produto" | "tipo_produto"
      tipo_produto: tipoProdutoPayload || null, // nome do produto OU categoria
    };

    try {
      const response = await fetch(
        `http://191.52.6.89:5000/editar_cupom/${cupomInicial?.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        }
      );

      // Força leitura do corpo para conseguir mensagem de erro, se houver
      const text = await response.text();
      if (!response.ok) {
        console.error("Resposta do backend:", text);
        throw new Error(text || "Erro ao atualizar cupom.");
      }

      let result = {};
      try { result = JSON.parse(text); } catch { /* ok se vier vazio */ }
      alert(result.message || "Cupom atualizado com sucesso!");

      onConfirm && onConfirm();
      onClose && onClose();
    } catch (error) {
      console.error("Erro ao atualizar cupom:", error);
      setErrorMsg("Erro ao salvar alterações. Verifique valores numéricos e a data.");
    } finally {
      setLoading(false);
    }
  };

  const caixaSugestoes = {
    border: "1px solid #ccc",
    borderRadius: 8,
    marginTop: 6,
    maxHeight: 180,
    overflowY: "auto",
    background: "#fff",
    width: "100%",
    position: "absolute",
    left: 0,
    top: "100%",
    zIndex: 50,
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
  };
  const itemSugestao = { padding: "8px 10px", cursor: "pointer" };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>
              Editar Cupom: {cupomInicial?.id ?? "-"}
            </h2>
            <button className={styles.botaoCancelar} type="button" onClick={onClose}>
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Código */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Código do cupom</label>
              <input
                className={styles.input}
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tipo (enum do banco) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de desconto</label>
              <select
                className={styles.input}
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="valor_fixo">Valor fixo (R$)</option>
                <option value="percentual">Percentual (%)</option>
                <option value="frete">Frete (%)</option>
              </select>
            </div>

            {/* Campos condicionais */}
            {formData.tipo === "valor_fixo" && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Desconto fixo (R$)</label>
                <input
                  className={styles.input}
                  type="text"
                  name="descontofixo"
                  value={formData.descontofixo}
                  onChange={handleChange}
                  placeholder="Ex.: 14,99"
                />
              </div>
            )}

            {formData.tipo === "percentual" && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Desconto (%)</label>
                <input
                  className={styles.input}
                  type="text"
                  name="descontoPorcentagem"
                  value={formData.descontoPorcentagem}
                  onChange={handleChange}
                  placeholder="Ex.: 15,5"
                />
              </div>
            )}

            {formData.tipo === "frete" && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Frete (%)</label>
                <input
                  className={styles.input}
                  type="text"
                  name="descontofrete"
                  value={formData.descontofrete}
                  onChange={handleChange}
                  placeholder="Ex.: 100"
                />
              </div>
            )}

            {/* Valor mínimo */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Valor mínimo da compra</label>
              <input
                className={styles.input}
                type="text"
                name="valor_minimo"
                value={formData.valor_minimo}
                onChange={handleChange}
                placeholder="Ex.: 0,00"
              />
            </div>

            {/* Validade */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Validade</label>
              <input
                className={styles.input}
                type="text"
                name="validade"
                value={formData.validade}
                onChange={handleChange}
                placeholder="aaaa-mm-dd ou dd/mm/aaaa"
              />
            </div>

            {/* Usos permitidos */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Usos permitidos</label>
              <input
                className={styles.input}
                type="number"
                name="usos_permitidos"
                min="0"
                value={formData.usos_permitidos}
                onChange={handleChange}
              />
            </div>

            {/* Aplicação */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Aplicar em</label>
              <select
                className={styles.input}
                name="aplicacao"
                value={formData.aplicacao}
                onChange={handleChange}
              >
                <option value="produto">Produto</option>
                <option value="tipo_produto">Tipo de Produto</option>
              </select>
            </div>

            {/* Produto com sugestões */}
            {formData.aplicacao === "produto" && (
              <div className={styles.formGroup} style={{ position: "relative" }}>
                <label className={styles.label}>Produto</label>
                <input
                  className={styles.input}
                  type="text"
                  name="produtoSelecionado"
                  value={formData.produtoSelecionado}
                  onChange={(e) => {
                    handleChange(e);
                    setShowSugestoesProduto(true);
                  }}
                  onFocus={() => setShowSugestoesProduto(true)}
                  onBlur={() => setTimeout(() => setShowSugestoesProduto(false), 120)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite para buscar por nome ou categoria..."
                  autoComplete="off"
                />
                {showSugestoesProduto &&
                  formData.produtoSelecionado &&
                  produtosSugeridos.length > 0 && (
                    <div style={caixaSugestoes}>
                      {produtosSugeridos.map((p) => (
                        <div
                          key={p.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({ ...prev, produtoSelecionado: p.nome }));
                            setShowSugestoesProduto(false);
                          }}
                          style={itemSugestao}
                        >
                          <div style={{ fontWeight: 600 }}>{p.nome}</div>
                          <div style={{ fontSize: 12, opacity: 0.7 }}>{p.categoria}</div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* Tipo de Produto com sugestões */}
            {formData.aplicacao === "tipo_produto" && (
              <div className={styles.formGroup} style={{ position: "relative" }}>
                <label className={styles.label}>Tipo de Produto</label>
                <input
                  className={styles.input}
                  type="text"
                  name="tipo_produto"
                  value={formData.tipo_produto}
                  onChange={(e) => {
                    handleChange(e);
                    setShowSugestoesTipo(true);
                  }}
                  onFocus={() => setShowSugestoesTipo(true)}
                  onBlur={() => setTimeout(() => setShowSugestoesTipo(false), 120)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite para buscar o tipo/categoria..."
                  autoComplete="off"
                />
                {showSugestoesTipo &&
                  formData.tipo_produto &&
                  tiposSugeridos.length > 0 && (
                    <div style={caixaSugestoes}>
                      {tiposSugeridos.map((t, i) => (
                        <div
                          key={`${t}-${i}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({ ...prev, tipo_produto: t }));
                            setShowSugestoesTipo(false);
                          }}
                          style={itemSugestao}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            <button type="submit" className={styles.botaoEnviar} disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
