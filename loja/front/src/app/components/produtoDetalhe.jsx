"use client";
import React, { useState } from "react";
import styles from "../styles/produtoDetalhe.module.css";
// ❌ removido useCarrinho
// import { useCarrinho } from "../context/carrinhoContext";
import { addItem } from "../lib/cartApi"; // ✅ helper que fala com o backend

function toNumberBR(v) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  return Number(
    String(v)
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
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

  const imagens = [imagemPrincipal, imagemSecundaria, imagemTerciaria].filter(
    Boolean
  );

  const handleTrocarImagem = (novaImagem) => setImagemAtual(novaImagem);

  const precoNum = toNumberBR(preco);
  const precoFormatado = Number(precoNum).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
        // se o backend buscar o preço atual, pode omitir:
        preco: isNaN(precoNum) ? undefined : precoNum,
      });

      // Checagem defensiva de erro vindo do backend
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

  const handleCalcularCep = (e) => {
    e.preventDefault();
    if (!cep) return alert("Informe um CEP válido");
    // Aqui você pode chamar sua API de frete/CEP
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
