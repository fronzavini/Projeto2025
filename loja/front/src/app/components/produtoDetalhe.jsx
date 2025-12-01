"use client";
import React, { useState } from "react";
import styles from "../styles/produtoDetalhe.module.css";
import { addItem } from "../lib/cartApi"; // helper que fala com o backend

// ✅ Corrigido: conversor robusto de valores monetários BR/US
function toNumberBR(v) {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;

  const s = String(v).trim();

  // 1) Tem vírgula e ponto -> assume ponto como milhar e vírgula como decimal (ex: 1.234,56)
  if (s.includes(",") && s.includes(".")) {
    const semMilhar = s.replace(/\./g, ""); // remove pontos de milhar
    return Number(semMilhar.replace(",", ".")); // vírgula vira decimal
  }

  // 2) Só vírgula -> decimal BR (ex: 0,50)
  if (s.includes(",") && !s.includes(".")) {
    return Number(s.replace(",", "."));
  }

  // 3) Só ponto -> decimal padrão (ex: 0.50)
  // 4) Nem ponto nem vírgula -> número inteiro
  return Number(s);
}

export default function ProdutoDetalhe({
  id,
  imagemPrincipal,
  imagemSecundaria,
  imagemTerciaria,
  nome,
  preco,
  descricao,
}) {
  const [imagemAtual, setImagemAtual] = useState(imagemPrincipal);
  const [adicionado, setAdicionado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [cep, setCep] = useState("");

  // filtra imagens válidas
  const imagens = [imagemPrincipal, imagemSecundaria, imagemTerciaria].filter(
    Boolean
  );

  const handleTrocarImagem = (novaImagem) => setImagemAtual(novaImagem);

  // ✅ conversão e formatação corrigidas
  const precoNum = toNumberBR(preco);
  const precoFormatado = precoNum.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // ✅ Adicionar ao carrinho
  const handleAddToCart = async () => {
    setErro(null);
    if (!id) return;

    try {
      const userData =
        typeof window !== "undefined"
          ? localStorage.getItem("usuario_loja")
          : null;
      const idUsuario =
        (userData && JSON.parse(userData)?.id) ||
        (typeof window !== "undefined"
          ? Number(localStorage.getItem("idUsuario"))
          : null);

      if (!idUsuario) {
        setErro("Você precisa estar logado para adicionar ao carrinho.");
        return;
      }

      setLoading(true);

      const resp = await addItem(idUsuario, {
        produtoId: Number(id),
        quantidade: 1,
        preco: isNaN(precoNum) ? undefined : precoNum,
      });

      const rawMsg = (resp?.message || resp?.erro || "")
        .toString()
        .toLowerCase();
      if (!resp || rawMsg.includes("erro")) {
        setErro("Não foi possível adicionar o produto. Tente novamente.");
        return;
      }

      setAdicionado(true);
      setTimeout(() => setAdicionado(false), 2000);
    } catch (e) {
      console.error("Erro ao adicionar ao carrinho:", e);
      setErro("Erro ao adicionar ao carrinho. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Calcular CEP (placeholder)
  const handleCalcularCep = (e) => {
    e.preventDefault();
    if (!cep) return alert("Informe um CEP válido");
    console.log("CEP informado:", cep);
  };

  return (
    <div className={styles.container}>
      {/* Coluna de imagens */}
      <div className={styles.colunaImagens}>
        <div className={styles.imagensMenores}>
          {imagens.map((img, idx) => (
            <img
              key={idx}
              className={`${styles.imagemMenor} ${
                imagemAtual === img ? styles.imagemMenorAtiva : ""
              }`}
              src={img}
              alt={`${nome} - Foto ${idx + 1}`}
              onClick={() => handleTrocarImagem(img)}
            />
          ))}
        </div>

        <div className={styles.imagemPrincipalContainer}>
          <img
            className={styles.imagemPrincipal}
            src={imagemAtual}
            alt={nome}
          />
        </div>
      </div>

      {/* Coluna de informações */}
      <div className={styles.colunaInfo}>
        <h1 className={styles.nome}>{nome}</h1>

        <div className={styles.precoContainer}>
          <p className={styles.preco}>R$ {precoFormatado}</p>
          <span className={styles.aVista}>à vista</span>
        </div>

        <button
          onClick={handleAddToCart}
          className={styles.botaoSacola}
          disabled={adicionado || loading}
          title={loading ? "Adicionando..." : "Adicionar à sacola"}
        >
          {adicionado ? "ADICIONADO" : "ADICIONAR À SACOLA"}
        </button>

        {adicionado && (
          <p className={styles.mensagemAdicionado}>
            Produto adicionado ao carrinho!
          </p>
        )}
        {erro && <p className={styles.mensagemErro}>{erro}</p>}

        {/* Opções de entrega */}
        <div className={styles.opcaoEntrega}>
          <span className={styles.entregaTitle}>Receba em casa</span>
          <p className={styles.entregaDescricao}>
            Informe seu CEP para consultar os prazos de entrega no seu endereço.
          </p>

          <form className={styles.formCep} onSubmit={handleCalcularCep}>
            <input
              type="text"
              placeholder="00000-000"
              className={styles.inputCep}
              maxLength="9"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            <button type="submit" className={styles.botaoCep}>
              CALCULAR
            </button>
          </form>

          <span className={styles.naoSabeCep}>Não sabe seu CEP?</span>
        </div>
      </div>

      {/* Descrição do produto */}
      <div className={styles.descricaoCompleta}>
        <h3 className={styles.descricaoTitle}>Descrição do produto</h3>
        <p className={styles.descricaoText}>{descricao}</p>
      </div>
    </div>
  );
}
