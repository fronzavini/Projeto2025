"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CarrinhoContext = createContext();

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context)
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  return context;
};

const DADOS_INICIAIS = {
  itensPedido: [],
  enderecoEntrega: {},
  valoresTotais: {
    subtotal: 0,
    total: 0,
    frete: "Grátis",
  },
};

export const CarrinhoProvider = ({ children }) => {
  const [dadosCheckout, setDadosCheckout] = useState(DADOS_INICIAIS);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem("carrinho");
      if (dadosSalvos) {
        const parsed = JSON.parse(dadosSalvos);
        // Filtra itens sem ID
        const itensValidos =
          parsed.itensPedido?.filter((i) => i?.id != null) || [];
        setDadosCheckout({ ...parsed, itensPedido: itensValidos });
      }
    } catch (err) {
      console.error("Erro ao ler carrinho do localStorage:", err);
    }
  }, []);

  // Salvar no localStorage sempre que dadosCheckout mudar
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(dadosCheckout));
  }, [dadosCheckout]);

  // --- Funções para manipular o carrinho ---

  const adicionarItem = (item) => {
    if (!item?.id) {
      console.error("Produto sem ID não pode ser adicionado ao carrinho");
      return;
    }

    setDadosCheckout((prev) => {
      const itemId = item.id.toString();
      const itemExistente = prev.itensPedido.find(
        (i) => i.id.toString() === itemId
      );

      let novosItens;
      if (itemExistente) {
        novosItens = prev.itensPedido.map((i) =>
          i.id.toString() === itemId
            ? { ...i, quantidade: i.quantidade + (item.quantidade || 1) }
            : i
        );
      } else {
        novosItens = [
          ...prev.itensPedido,
          { ...item, id: itemId, quantidade: item.quantidade || 1 },
        ];
      }

      const subtotal = novosItens.reduce(
        (acc, i) => acc + i.quantidade * i.preco,
        0
      );

      return {
        ...prev,
        itensPedido: novosItens,
        valoresTotais: {
          ...prev.valoresTotais,
          subtotal,
          total: subtotal,
        },
      };
    });
  };

  const removerItem = (idItem) => {
    if (!idItem) return;

    setDadosCheckout((prev) => {
      const idStr = idItem.toString();
      const novosItens = prev.itensPedido.filter(
        (i) => i?.id != null && i.id.toString() !== idStr
      );
      const subtotal = novosItens.reduce(
        (acc, i) => acc + i.quantidade * i.preco,
        0
      );

      return {
        ...prev,
        itensPedido: novosItens,
        valoresTotais: {
          ...prev.valoresTotais,
          subtotal,
          total: subtotal,
        },
      };
    });
  };

  const atualizarQuantidade = (idItem, quantidade) => {
    if (!idItem || quantidade <= 0) return;

    setDadosCheckout((prev) => {
      const idStr = idItem.toString();
      const novosItens = prev.itensPedido.map((i) =>
        i.id.toString() === idStr ? { ...i, quantidade } : i
      );

      const subtotal = novosItens.reduce(
        (acc, i) => acc + i.quantidade * i.preco,
        0
      );

      return {
        ...prev,
        itensPedido: novosItens,
        valoresTotais: {
          ...prev.valoresTotais,
          subtotal,
          total: subtotal,
        },
      };
    });
  };

  const limparCarrinho = () => setDadosCheckout(DADOS_INICIAIS);

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
