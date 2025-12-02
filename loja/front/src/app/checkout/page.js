"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/checkout.module.css";
import ResumoPedidoLateral from "../components/resumoPedidoLateral";
import PrincipalCheckout from "../components/principalCheckout";

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://191.52.6.89:5000";

export default function Checkout() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [itensPedido, setItensPedido] = useState([]);
  const [enderecoEntrega] = useState(null); // se quiser, alimente com dados reais do cliente
  const [totalServer, setTotalServer] = useState(0);

  // Carrega carrinho do backend
  useEffect(() => {
    (async () => {
      try {
        setErro(null);
        const rawUser =
          typeof window !== "undefined"
            ? localStorage.getItem("usuario_loja")
            : null;
        const user = rawUser ? JSON.parse(rawUser) : null;
        const idUsuario =
          user?.id ||
          (typeof window !== "undefined"
            ? Number(localStorage.getItem("idUsuario"))
            : null);

        if (!idUsuario) {
          setItensPedido([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE}/carrinho/usuario/${idUsuario}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(await res.text());
        const carrinho = await res.json();
        setTotalServer(Number(carrinho?.valorTotal || 0));

        const itens = Array.isArray(carrinho?.produtos)
          ? carrinho.produtos
          : [];

        // Enriquecer itens com nome/imagem
        const enriquecidos = await Promise.all(
          itens.map(async (i) => {
            try {
              const r = await fetch(`${BASE}/produto_id/${i.produto_id}`, {
                cache: "no-store",
              });
              const p = r.ok ? await r.json() : null;
              return {
                id: i.produto_id,
                nome: p?.nome || `Produto #${i.produto_id}`,
                imagem: p?.imagem_1 || p?.imagem || "/placeholder.png",
                quantidade: Number(i.quantidade || 0),
                preco: Number(
                  i.preco_unitario != null ? i.preco_unitario : p?.preco || 0
                ),
              };
            } catch {
              return {
                id: i.produto_id,
                nome: `Produto #${i.produto_id}`,
                imagem: "/placeholder.png",
                quantidade: Number(i.quantidade || 0),
                preco: Number(i.preco_unitario || 0),
              };
            }
          })
        );

        setItensPedido(enriquecidos);
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar o seu checkout.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Totais calculados localmente (fallback ao valor do servidor)
  const valoresTotais = useMemo(() => {
    const subtotal = itensPedido.reduce(
      (acc, i) => acc + Number(i.preco) * Number(i.quantidade),
      0
    );
    // caso o backend já mantenha um total diferente (ex.: descontos), use-o
    const total = totalServer > 0 ? totalServer : subtotal;
    return { subtotal, total, frete: "Grátis" };
  }, [itensPedido, totalServer]);

  if (loading) {
    return (
      <div className={styles.containerGeral}>
        <p className="text-center text-gray-500 p-8">
          <FontAwesomeIcon icon={faShoppingCart} /> Carregando dados do pedido…
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className={styles.containerGeral}>
        <p className="text-center text-red-600 p-8">{erro}</p>
      </div>
    );
  }

  if (!itensPedido || itensPedido.length === 0) {
    return (
      <div className={styles.containerGeral}>
        <p className="text-center text-gray-500 p-8">
          <FontAwesomeIcon icon={faShoppingCart} /> Seu carrinho está vazio.
        </p>
      </div>
    );
  }

  const handleVoltar = () => router.back();

  return (
    <div className={styles.containerGeral}>
      {/* Botão de Voltar */}
      <div className={styles.areaVoltar}>
        <button className={styles.botaoVoltar} onClick={handleVoltar}>
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar para o carrinho
        </button>
      </div>

      <div className={styles.colunasConteudo}>
        <div className={styles.colunaPrincipal}>
          <PrincipalCheckout
            itens={itensPedido}
            valoresTotais={valoresTotais}
          />
        </div>
        <div className={styles.colunaLateral}>
          <ResumoPedidoLateral
            itensPedido={itensPedido}
            enderecoEntrega={enderecoEntrega}
            valoresTotais={valoresTotais}
          />
        </div>
      </div>
    </div>
  );
}
