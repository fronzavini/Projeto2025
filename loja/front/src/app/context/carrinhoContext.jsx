"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// URL do backend Flask
const BACKEND_URL = "http://127.0.0.1:5000";

const CarrinhoContext = createContext();

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context)
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  return context;
};

export const CarrinhoProvider = ({ children, idUsuario }) => {
  const [dadosCheckout, setDadosCheckout] = useState({
    idCarrinho: null,
    itensPedido: [],
    valoresTotais: { subtotal: 0, total: 0, frete: "Grátis" },
  });

  // --- Carregar ou criar carrinho ao iniciar ---
  useEffect(() => {
    if (!idUsuario) return;

    const carregarOuCriarCarrinho = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/carrinho/usuario/${idUsuario}`);
        if (res.ok) {
          const carrinho = await res.json();
          setDadosCheckout({
            idCarrinho: carrinho.id,
            itensPedido: carrinho.produtos.map((p) => ({
              id: p.produto_id,
              quantidade: p.quantidade,
              preco: p.preco_unitario,
            })),
            valoresTotais: {
              subtotal: carrinho.valorTotal,
              total: carrinho.valorTotal,
              frete: "Grátis",
            },
          });
        } else {
          // Cria um novo carrinho se não existir
          const criarRes = await fetch(`${BACKEND_URL}/criar_carrinho`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario }),
          });
          const data = await criarRes.json();
          setDadosCheckout({
            idCarrinho: data.carrinho.id,
            itensPedido: [],
            valoresTotais: { subtotal: 0, total: 0, frete: "Grátis" },
          });
        }
      } catch (err) {
        console.error("Erro ao carregar/criar carrinho:", err);
      }
    };

    carregarOuCriarCarrinho();
  }, [idUsuario]);

  // --- Garantir carrinho existente ---
  const garantirCarrinho = async () => {
    if (!dadosCheckout.idCarrinho && idUsuario) {
      const res = await fetch(`${BACKEND_URL}/criar_carrinho`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario }),
      });
      const data = await res.json();
      setDadosCheckout((prev) => ({ ...prev, idCarrinho: data.carrinho.id }));
      return data.carrinho.id;
    }
    return dadosCheckout.idCarrinho;
  };

  // --- Adicionar item ---
  const adicionarItem = async (item) => {
    if (!item?.id || !item.preco) return;
    const idCarrinhoAtual = await garantirCarrinho();

    try {
      const res = await fetch(
        `${BACKEND_URL}/carrinho/${idCarrinhoAtual}/adicionar_item`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produto_id: item.id,
            quantidade: item.quantidade || 1,
            preco_unitario: item.preco,
          }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        console.error("Erro no backend ao adicionar item:", text);
        return;
      }

      // Atualiza estado local
      setDadosCheckout((prev) => {
        const itemExistente = prev.itensPedido.find((i) => i.id === item.id);
        const novosItens = itemExistente
          ? prev.itensPedido.map((i) =>
              i.id === item.id
                ? { ...i, quantidade: i.quantidade + (item.quantidade || 1) }
                : i
            )
          : [
              ...prev.itensPedido,
              {
                id: item.id,
                quantidade: item.quantidade || 1,
                preco: item.preco,
              },
            ];

        const subtotal = novosItens.reduce(
          (acc, i) => acc + i.quantidade * i.preco,
          0
        );
        return {
          ...prev,
          itensPedido: novosItens,
          valoresTotais: { subtotal, total: subtotal, frete: "Grátis" },
        };
      });
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
    }
  };

  // --- Remover item ---
  const removerItem = async (idItem) => {
    if (!idItem) return;
    const idCarrinhoAtual = await garantirCarrinho();

    try {
      const res = await fetch(
        `${BACKEND_URL}/carrinho/${idCarrinhoAtual}/remover_item/${idItem}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const text = await res.text();
        console.error("Erro no backend ao remover item:", text);
        return;
      }

      setDadosCheckout((prev) => {
        const novosItens = prev.itensPedido.filter((i) => i.id !== idItem);
        const subtotal = novosItens.reduce(
          (acc, i) => acc + i.quantidade * i.preco,
          0
        );
        return {
          ...prev,
          itensPedido: novosItens,
          valoresTotais: { subtotal, total: subtotal, frete: "Grátis" },
        };
      });
    } catch (err) {
      console.error("Erro ao remover item:", err);
    }
  };

  // --- Atualizar quantidade ---
  const atualizarQuantidade = async (idItem, quantidade) => {
    if (!idItem || quantidade <= 0) return;
    const idCarrinhoAtual = await garantirCarrinho();

    try {
      const res = await fetch(
        `${BACKEND_URL}/carrinho/${idCarrinhoAtual}/atualizar_item`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produto_id: idItem, quantidade }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        console.error("Erro no backend ao atualizar item:", text);
        return;
      }

      setDadosCheckout((prev) => {
        const novosItens = prev.itensPedido.map((i) =>
          i.id === idItem ? { ...i, quantidade } : i
        );
        const subtotal = novosItens.reduce(
          (acc, i) => acc + i.quantidade * i.preco,
          0
        );
        return {
          ...prev,
          itensPedido: novosItens,
          valoresTotais: { subtotal, total: subtotal, frete: "Grátis" },
        };
      });
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
    }
  };

  // --- Limpar carrinho ---
  const limparCarrinho = async () => {
    const idCarrinhoAtual = await garantirCarrinho();
    if (idCarrinhoAtual) {
      try {
        await fetch(`${BACKEND_URL}/deletar_carrinho/${idCarrinhoAtual}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Erro ao deletar carrinho:", err);
      }
    }
    setDadosCheckout({
      idCarrinho: null,
      itensPedido: [],
      valoresTotais: { subtotal: 0, total: 0, frete: "Grátis" },
    });
  };

  return (
    <CarrinhoContext.Provider
      value={{
        dadosCheckout,
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
