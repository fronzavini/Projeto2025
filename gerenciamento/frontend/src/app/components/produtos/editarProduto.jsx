"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function EditarProduto({ onClose, produto }) {
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    marca: "",
    preco: 0,
    quantidadeEstoque: 0,
    estoqueMinimo: 0,
    estado: true,
    fornecedor_id: "",
    imagem_1: "",
    imagem_2: "",
    imagem_3: "",
  });

  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const API = "http://192.168.18.155:5000";

  // Preenche formData quando produto chegar (dados vindos do backend)
  useEffect(() => {
    if (!produto) return;

    // Tenta extrair 3 imagens de várias formas possíveis:
    // 1) campos diretos produto.imagem_1 etc
    // 2) produto.imagens como array de objetos {url: ...} ou strings
    const imagensFromFields = [
      produto.imagem_1 ?? "",
      produto.imagem_2 ?? "",
      produto.imagem_3 ?? "",
    ].map((v) => (v === null ? "" : v));

    let imagens = imagensFromFields;

    if ((!imagens[0] || !imagens[1] || !imagens[2]) && produto.imagens) {
      // produto.imagens pode ser array de objetos {url: "..."} ou array de strings
      const arr = produto.imagens.map((it) => (typeof it === "string" ? it : it?.url || ""));
      imagens = [
        imagens[0] || arr[0] || "",
        imagens[1] || arr[1] || "",
        imagens[2] || arr[2] || "",
      ];
    }

    setFormData((old) => ({
      ...old,
      nome: produto.nome || "",
      categoria: produto.categoria || "",
      marca: produto.marca || "",
      preco: Number(produto.preco) || 0,
      quantidadeEstoque: Number(produto.quantidade_estoque) || 0,
      estoqueMinimo: Number(produto.estoque_minimo) || 0,
      estado: produto.estado ?? true,
      fornecedor_id: produto.fornecedor_id ?? "",
      imagem_1: imagens[0] || "",
      imagem_2: imagens[1] || "",
      imagem_3: imagens[2] || "",
    }));
  }, [produto]);

  // Fallback: se depois de um pequeno atraso não houver imagens, tenta ler do DOM
  useEffect(() => {
    if (!produto) return;

    // Se já temos urls preenchidas, não precisa ler do DOM
    if (formData.imagem_1 || formData.imagem_2 || formData.imagem_3) return;

    // Tenta ler do DOM: procura imgs com data-prod-id igual ao id do produto
    // (requer que a TabelaProduto adicione data-prod-id nos <img>)
    const tryFillFromDOM = () => {
      try {
        const selector = `img[data-prod-id="${produto.id}"]`;
        const imgs = Array.from(document.querySelectorAll(selector));
        if (!imgs || imgs.length === 0) return;

        const urls = imgs.map((el) => el.getAttribute("src") || el.src || "");
        // Preenche as 3 imagens com o que encontrou (ou vazio)
        setFormData((old) => ({
          ...old,
          imagem_1: old.imagem_1 || urls[0] || "",
          imagem_2: old.imagem_2 || urls[1] || "",
          imagem_3: old.imagem_3 || urls[2] || "",
        }));
      } catch (err) {
        // nada — leitura DOM é apenas fallback
        console.warn("Falha ao ler imagens do DOM:", err);
      }
    };

    // rodar após micro-tarefa para dar tempo de DOM atualizar (se for o caso)
    const t = setTimeout(tryFillFromDOM, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produto, formData.imagem_1, formData.imagem_2, formData.imagem_3]);

  // Carregar fornecedores (igual ao seu código)
  useEffect(() => {
    async function carregarFornecedores() {
      try {
        const res = await fetch(`${API}/listar_fornecedores`);
        if (!res.ok) throw new Error("Erro ao carregar fornecedores");
        const body = await res.json();
        const listaBruta = Array.isArray(body) ? body : body.detalhes ?? [];
        const lista = listaBruta.map((f) => {
          if (Array.isArray(f)) return { id: f[0], nome_empresa: f[1] };
          return { id: f.id ?? f[0], nome_empresa: f.nome_empresa ?? f.nome ?? "" };
        });
        setFornecedores(lista);
      } catch (err) {
        console.error("Carregar fornecedores:", err);
        setFornecedores([]);
      }
    }
    carregarFornecedores();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      nome: formData.nome,
      categoria: formData.categoria,
      marca: formData.marca,
      preco: Number(formData.preco),
      quantidadeEstoque: Number(formData.quantidadeEstoque),
      estoqueMinimo: Number(formData.estoqueMinimo),
      estado: formData.estado,
      fornecedor_id: formData.fornecedor_id ? Number(formData.fornecedor_id) : null,
      imagem_1: formData.imagem_1 || null,
      imagem_2: formData.imagem_2 || null,
      imagem_3: formData.imagem_3 || null,
    };

    try {
      const response = await fetch(`${API}/editar_produto/${produto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao atualizar produto");

      const result = await response.json();
      alert(result.message || "Produto atualizado com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao atualizar produto.");
    } finally {
      setLoading(false);
    }
  };

  const renderImagemPreview = (url) => {
    if (!url) return null;
    return (
      <img
        src={url}
        alt="Preview"
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          marginLeft: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      />
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Editar Produto: {produto?.id}</h2>
            <button className={styles.botaoCancelar} type="button" onClick={onClose}>
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Nome */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome</label>
              <input className={styles.input} name="nome" type="text" value={formData.nome} onChange={handleChange} required />
            </div>

            {/* Categoria / Marca */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Categoria</label>
                <input className={styles.input} name="categoria" value={formData.categoria} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Marca</label>
                <input className={styles.input} name="marca" value={formData.marca} onChange={handleChange} required />
              </div>
            </div>

            {/* Preço / Estoque */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Preço</label>
                <input className={styles.input} name="preco" type="number" step="0.01" value={formData.preco} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Qtd. Estoque</label>
                <input className={styles.input} name="quantidadeEstoque" type="number" value={formData.quantidadeEstoque} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estoque mínimo</label>
                <input className={styles.input} name="estoqueMinimo" type="number" value={formData.estoqueMinimo} onChange={handleChange} required />
              </div>
            </div>

            {/* Fornecedor */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fornecedor</label>
                <select className={styles.input} name="fornecedor_id" value={formData.fornecedor_id} onChange={handleChange}>
                  <option value="">-- Selecionar fornecedor --</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>{f.nome_empresa}</option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Ativo</label>
                <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} />
              </div>
            </div>
            {/* Imagens com preview */}
            <div className={styles.row}>
              {[1, 2, 3].map((num) => (
                <div key={num} className={styles.formGroup} style={{ display: "flex", alignItems: "center" }}>
                  <label className={styles.label} style={{ minWidth: 110 }}>{`Imagem ${num} (URL)`}</label>
                  <input
                    className={styles.input}
                    name={`imagem_${num}`}
                    type="text"
                    value={formData[`imagem_${num}`]}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                    placeholder="https://exemplo.com/img.jpg"
                  />
                  {renderImagemPreview(formData[`imagem_${num}`])}
                </div>
              ))}
            </div>

            <button type="submit" className={styles.botaoEnviar} disabled={loading}>
              {loading ? "Atualizando..." : "Salvar alterações"}
            </button>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
