"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://192.168.18.155:5000";

const CarrinhoContext = createContext(null);

export const useCarrinho = () => {
  const ctx = useContext(CarrinhoContext);
  if (!ctx)
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  return ctx;
};

export const CarrinhoProvider = ({ children, idUsuario }) => {
  const [dadosCheckout, setDadosCheckout] = useState({
    idCarrinho: null,
    itensPedido: [],
    valoresTotais: { subtotal: 0, total: 0, frete: "Grátis" },
  });

  const mapResponseToState = (carrinhoJson) => {
    const itens = (carrinhoJson?.produtos || []).map((p) => ({
      id: Number(p.produto_id),
      quantidade: Number(p.quantidade),
      preco: Number(p.preco_unitario),
    }));
    const subtotal = Number(carrinhoJson?.valorTotal || 0);
    return {
      idCarrinho: Number(carrinhoJson?.id) || null,
      itensPedido: itens,
      valoresTotais: { subtotal, total: subtotal, frete: "Grátis" },
    };
  };

  const fetchCarrinho = useCallback(
    async (idCarrinho) => {
      if (!idUsuario) return;

      const res = await fetch(`${BACKEND_URL}/carrinho/usuario/${idUsuario}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const carrinho = await res.json();
        setDadosCheckout(mapResponseToState(carrinho));
        return;
      }

      const criarRes = await fetch(`${BACKEND_URL}/criar_carrinho`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario }),
      });
      const data = await criarRes.json();
      const carrinho = data?.carrinho || data;
      setDadosCheckout(mapResponseToState(carrinho));
    },
    [idUsuario]
  );

  const carregarOuCriarCarrinho = useCallback(async () => {
    if (!idUsuario) return;
    try {
      await fetchCarrinho(dadosCheckout.idCarrinho);
    } catch (e) {
      console.error("Erro ao carregar/criar carrinho:", e);
    }
  }, [idUsuario, fetchCarrinho, dadosCheckout.idCarrinho]);

  useEffect(() => {
    carregarOuCriarCarrinho();
  }, [carregarOuCriarCarrinho]);

  const garantirCarrinhoId = useCallback(async () => {
    if (dadosCheckout.idCarrinho) return dadosCheckout.idCarrinho;
    await carregarOuCriarCarrinho();
    return new Promise((resolve) => {
      setTimeout(() => resolve(dadosCheckout.idCarrinho || 0), 0);
    });
  }, [dadosCheckout.idCarrinho, carregarOuCriarCarrinho]);

  const adicionarItem = useCallback(
    async (item) => {
      if (!idUsuario || !item?.id) return;
      const idCarrinhoAtual = await garantirCarrinhoId();
      if (!idCarrinhoAtual) return;

      const body = {
        produto_id: item.id,
        quantidade: item.quantidade ?? 1,
        ...(item.preco != null ? { preco_unitario: item.preco } : {}),
      };

      const res = await fetch(
        `${BACKEND_URL}/carrinho/${idCarrinhoAtual}/adicionar_item`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        console.error("Erro ao adicionar item:", await res.text());
        return;
      }

      await fetchCarrinho(idCarrinhoAtual);
    },
    [idUsuario, garantirCarrinhoId, fetchCarrinho]
  );

  const removerItem = useCallback(
    async (idItem) => {
      if (!idUsuario || !idItem) return;
      const idCarrinhoAtual = await garantirCarrinhoId();
      if (!idCarrinhoAtual) return;

      const res = await fetch(
        `${BACKEND_URL}/carrinho/${idCarrinhoAtual}/remover_item/${idItem}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        console.error("Erro ao remover item:", await res.text());
        return;
      }
      await fetchCarrinho(idCarrinhoAtual);
    },
    [idUsuario, garantirCarrinhoId, fetchCarrinho]
  );

  const atualizarQuantidade = useCallback(
    async (idItem, quantidade) => {
      if (!idUsuario || !idItem || quantidade < 0) return;
      const idCarrinhoAtual = await garantirCarrinhoId();
      if (!idCarrinhoAtual) return;

      const res = await fetch(
        `${BACKEND_URL}/carrinho/${idCarrinhoAtual}/atualizar_item`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produto_id: idItem, quantidade }),
        }
      );
      if (!res.ok) {
        console.error("Erro ao atualizar item:", await res.text());
        return;
      }
      await fetchCarrinho(idCarrinhoAtual);
    },
    [idUsuario, garantirCarrinhoId, fetchCarrinho]
  );

  const limparCarrinho = useCallback(async () => {
    const idCarrinhoAtual = dadosCheckout.idCarrinho;
    if (idCarrinhoAtual) {
      try {
        await fetch(`${BACKEND_URL}/deletar_carrinho/${idCarrinhoAtual}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Erro ao deletar carrinho:", e);
      }
    }
    setDadosCheckout({
      idCarrinho: null,
      itensPedido: [],
      valoresTotais: { subtotal: 0, total: 0, frete: "Grátis" },
    });
  }, [dadosCheckout.idCarrinho]);

  return (
    <CarrinhoContext.Provider
      value={{
        dadosCheckout,
        carregarOuCriarCarrinho,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
