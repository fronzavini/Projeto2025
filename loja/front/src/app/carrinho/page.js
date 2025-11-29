"use client";

import React, { useState, useMemo } from "react";
import ItemCarrinho from "../components/itemCarrinho";
import ResumoCompra from "../components/resumoCompra";
import styles from "../styles/carrinho.module.css";
import { useRouter } from "next/navigation";

// Dados iniciais fictícios
const initialProdutos = [
  {
    id: 1,
    nome: "Boné New Era 9Forty Chicago Red Bulls Metallic P25...",
    referencia: "BRJ-7724-006-01",
    cor: "Preto",
    tamanho: "Único",
    quantidade: 1,
    preco: 279.9,
    imagem: "caminho/para/imagem.png",
  },
];

// Função auxiliar para cálculo
const calcularResumo = (produtos) => {
  const subtotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
  const frete = 0;
  const desconto = 0;
  const total = subtotal + frete - desconto;

  const parcelas = 4;
  const valorParcela = total / parcelas;

  return { subtotal, frete, desconto, total, parcelas, valorParcela };
};

export default function Carrinho() {
  const router = useRouter();
  const [produtos, setProdutos] = useState(initialProdutos);

  const dadosResumo = useMemo(() => calcularResumo(produtos), [produtos]);

  const handleQuantidadeChange = (produtoId, novaQuantidade) => {
    const quantidadeValida = Math.max(1, novaQuantidade);

    setProdutos((prev) =>
      prev.map((p) =>
        p.id === produtoId ? { ...p, quantidade: quantidadeValida } : p
      )
    );
  };

  return (
    <>
      {/* 🔙 BOTÃO VOLTAR (agora fica no topo, fora do flex!) */}
      <button className={styles.botaoVoltar} onClick={() => router.back()}>
        Voltar
      </button>

      <div className={styles.paginaCarrinhoContainer}>
        {/* Coluna esquerda — produtos */}
        <div className={styles.colunaCarrinho}>
          <h2 className={styles.tituloSecao}>Meu carrinho</h2>

          <div className={styles.listaProdutos}>
            {produtos.map((produto) => (
              <ItemCarrinho
                key={produto.id}
                produto={produto}
                onQuantidadeChange={handleQuantidadeChange}
              />
            ))}
          </div>

          <hr className={styles.separadorLoja} />

          {/* Consultar frete */}
          <div className={styles.consultarFrete}>
            <h3 className={styles.tituloSecaoMenor}>
              Consultar frete e prazo de entrega
            </h3>

            <div className={styles.inputFreteGrupo}>
              <input
                type="text"
                placeholder="89080-755"
                className={styles.inputCep}
                defaultValue="89080-755"
              />
              <button className={styles.botaoConsultar}>Consultar</button>
              <a href="#" className={styles.linkNaoSeiCep}>
                Não sei meu CEP
              </a>
            </div>
          </div>
        </div>

        {/* Coluna direita — resumo */}
        <div className={styles.colunaResumo}>
          <ResumoCompra dadosResumo={dadosResumo} />
        </div>
      </div>
    </>
  );
}
