"use client";

import React, { useState } from "react";
import styles from "../styles/produtoDetalhe.module.css";
import { useCarrinho } from "../context/carrinhoContext";

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
  const { adicionarItem } = useCarrinho();
  const [cep, setCep] = useState("");

  const imagens = [imagemPrincipal, imagemSecundaria, imagemTerciaria].filter(
    Boolean
  );

  const handleTrocarImagem = (novaImagem) => {
    setImagemAtual(novaImagem);
  };

  const precoFormatado = Number(preco).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleAddToCart = () => {
    if (!id) return;

    adicionarItem({
      id: id.toString(),
      nome,
      preco: Number(preco),
      quantidade: 1,
      imagem: imagemPrincipal,
    });

    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  const handleCalcularCep = (e) => {
    e.preventDefault();
    if (!cep) return alert("Informe um CEP válido");
    console.log("CEP informado:", cep);
    // Aqui você pode chamar a API de CEP
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
          disabled={adicionado}
        >
          {adicionado ? "ADICIONADO" : "ADICIONAR À SACOLA"}
        </button>

        {adicionado && (
          <p className={styles.mensagemAdicionado}>
            Produto adicionado ao carrinho!
          </p>
        )}

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
