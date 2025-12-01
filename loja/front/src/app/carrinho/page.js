"use client";

import React, { useEffect, useMemo, useState } from "react";
import ItemCarrinho from "../components/itemCarrinho";
import ResumoCompra from "../components/resumoCompra";
import styles from "../styles/carrinho.module.css";
import { useRouter } from "next/navigation";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

export default function Carrinho() {
  const router = useRouter();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Carrega carrinho do usuário
  useEffect(() => {
    (async () => {
      try {
        setErro(null);
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
          setProdutos([]);
          setLoading(false);
          return;
        }

        // Busca carrinho do usuário
        const res = await fetch(
          `${BACKEND_URL}/carrinho/usuario/${idUsuario}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error(await res.text());

        const carrinho = await res.json();
        const itens = Array.isArray(carrinho?.produtos)
          ? carrinho.produtos
          : [];

        // Enriquecer cada item com nome/imagem do produto
        const produtosEnriquecidos = await Promise.all(
          itens.map(async (i) => {
            try {
              const r = await fetch(
                `${BACKEND_URL}/produto_id/${i.produto_id}`,
                { cache: "no-store" }
              );
              const p = r.ok ? await r.json() : null;
              return {
                id: i.produto_id,
                nome: p?.nome || `Produto #${i.produto_id}`,
                preco: Number(i.preco_unitario ?? p?.preco ?? 0),
                quantidade: Number(i.quantidade || 0),
                imagem: p?.imagem_1 || p?.imagem || "", // se existir
              };
            } catch {
              return {
                id: i.produto_id,
                nome: `Produto #${i.produto_id}`,
                preco: Number(i.preco_unitario || 0),
                quantidade: Number(i.quantidade || 0),
                imagem: "",
              };
            }
          })
        );

        setProdutos(produtosEnriquecidos);
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
        setErro("Não foi possível carregar seu carrinho.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Cálculo do resumo local (mantido)
  const dadosResumo = useMemo(() => {
    const subtotal = produtos.reduce(
      (acc, p) => acc + Number(p.preco) * Number(p.quantidade),
      0
    );
    const frete = 0;
    const desconto = 0;
    const total = subtotal + frete - desconto;
    const parcelas = 4;
    const valorParcela = parcelas ? total / parcelas : total;
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

          {loading ? (
            <p>Carregando...</p>
          ) : erro ? (
            <p className={styles.mensagemErro}>{erro}</p>
          ) : (
            <div className={styles.listaProdutos}>
              {produtos.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
              ) : (
                produtos.map((produto) => (
                  <ItemCarrinho key={produto.id} produto={produto} />
                ))
              )}
            </div>
          )}

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
          {/* ResumoCompra agora busca do backend sozinho — não precisa de prop */}
          <ResumoCompra />
        </div>
      </div>
    </>
  );
}
