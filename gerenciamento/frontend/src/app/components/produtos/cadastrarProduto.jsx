"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarProduto({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    marca: "",
    preco: "",
    quantidade_estoque: "",
    estoque_minimo: "",
    estado: true,
    fornecedor_id: "",
    imagem_1: "", // URL da imagem 1
    imagem_2: "", // URL da imagem 2
    imagem_3: "", // URL da imagem 3
  });

  const [fornecedores, setFornecedores] = useState([]);
  const API = "http://191.52.6.89:5000";

  // Carregar fornecedores
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

  // Atualizar estado do formulário
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Submeter formulário
  async function handleSubmit(e) {
    e.preventDefault();

    const dadosProduto = {
      nome: form.nome,
      categoria: form.categoria,
      marca: form.marca,
      preco: parseFloat(form.preco),
      quantidadeEstoque: parseInt(form.quantidade_estoque, 10),
      estoqueMinimo: parseInt(form.estoque_minimo, 10),
      estado: form.estado,
      fornecedor_id: form.fornecedor_id ? parseInt(form.fornecedor_id, 10) : null,
      imagem_1: form.imagem_1 || null,
      imagem_2: form.imagem_2 || null,
      imagem_3: form.imagem_3 || null,
    };

    try {
      // 1️⃣ Criar produto
      const resProduto = await fetch(`${API}/criar_produto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosProduto),
      });

      if (!resProduto.ok) throw new Error("Erro ao cadastrar produto");

      const produtoCriado = await resProduto.json(); // ID do produto

      // 2️⃣ Cadastrar imagem se houver UR

      // Resetar formulário
      setForm({
        nome: "",
        categoria: "",
        marca: "",
        preco: "",
        quantidade_estoque: "",
        estoque_minimo: "",
        estado: true,
        fornecedor_id: "",
        imagem_1: "",
        imagem_2: "",
        imagem_3: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar produto ou imagem");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo produto</h2>
        <button className={styles.botaoCancelar} type="button" onClick={onClose}>Cancelar</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Campos do produto */}
        <div className={styles.formGroup}>
          <label htmlFor="nome" className={styles.label}>Nome</label>
          <input className={styles.input} id="nome" name="nome" type="text" value={form.nome} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categoria" className={styles.label}>Categoria</label>
          <input className={styles.input} id="categoria" name="categoria" type="text" value={form.categoria} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="marca" className={styles.label}>Marca</label>
          <input className={styles.input} id="marca" name="marca" type="text" value={form.marca} onChange={handleChange} required />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="preco" className={styles.label}>Preço</label>
            <input className={styles.input} id="preco" name="preco" type="number" step="0.01" value={form.preco} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="quantidade_estoque" className={styles.label}>Quantidade em estoque</label>
            <input className={styles.input} id="quantidade_estoque" name="quantidade_estoque" type="number" value={form.quantidade_estoque} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estoque_minimo" className={styles.label}>Estoque mínimo</label>
            <input className={styles.input} id="estoque_minimo" name="estoque_minimo" type="number" value={form.estoque_minimo} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="fornecedor_id" className={styles.label}>Fornecedor</label>
            <select className={styles.input} id="fornecedor_id" name="fornecedor_id" value={form.fornecedor_id} onChange={handleChange}>
              <option value="">-- Selecionar fornecedor --</option>
              {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.nome_empresa}</option>)}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estado" className={styles.label}>Ativo</label>
            <input className={styles.checkbox} id="estado" name="estado" type="checkbox" checked={form.estado} onChange={handleChange} />
          </div>
        </div>

        {/* Campo da imagem */}
        <div className={styles.formGroup}>
          <label htmlFor="imagem_1" className={styles.label}>URL da Imagem</label>
          <input className={styles.input} id="imagem_1" name="imagem_1" type="text" value={form.imagem_1} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
          <label htmlFor="imagem_2" className={styles.label}>URL da Imagem</label>
          <input className={styles.input} id="imagem_2" name="imagem_2" type="text" value={form.imagem_2} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
          <label htmlFor="imagem_3" className={styles.label}>URL da Imagem</label>
          <input className={styles.input} id="imagem_3" name="imagem_3" type="text" value={form.imagem_3} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
        </div>

        <button type="submit" className={styles.botaoEnviar}>Cadastrar produto</button>
      </form>
    </div>
  );
}
