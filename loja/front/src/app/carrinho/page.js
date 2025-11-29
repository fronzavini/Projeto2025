"use client";

import React, { useMemo } from "react";
import ItemCarrinho from "../components/itemCarrinho";
import ResumoCompra from "../components/resumoCompra";
import styles from "../styles/carrinho.module.css";
import { useRouter } from "next/navigation";
import { useCarrinho } from "../context/carrinhoContext"; // <-- import

export default function Carrinho() {
  const router = useRouter();
  const { dadosCheckout } = useCarrinho(); // pega os itens do carrinho global

  const produtos = dadosCheckout.itensPedido;

  // Função para calcular resumo
  const dadosResumo = useMemo(() => {
    const subtotal = produtos.reduce(
      (acc, p) => acc + p.preco * p.quantidade,
      0
    );
    const frete = 0;
    const desconto = 0;
    const total = subtotal + frete - desconto;

    const parcelas = 4;
    const valorParcela = total / parcelas;

    return { subtotal, frete, desconto, total, parcelas, valorParcela };
  }, [produtos]);

  return (
    <>
      {/* 🔙 BOTÃO VOLTAR */}
      <button className={styles.botaoVoltar} onClick={() => router.back()}>
        Voltar
      </button>

      <div className={styles.paginaCarrinhoContainer}>
        {/* Coluna esquerda — produtos */}
        <div className={styles.colunaCarrinho}>
          <h2 className={styles.tituloSecao}>Meu carrinho</h2>

          <div className={styles.listaProdutos}>
            {produtos.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              produtos.map((produto) => (
                <ItemCarrinho key={produto.id} produto={produto} />
              ))
            )}
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
