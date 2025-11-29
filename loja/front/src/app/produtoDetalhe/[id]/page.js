"use client";

import React from "react";
import { produtos } from "../../data/produtos";
import { arranjos } from "../../data/arranjos";
import ProdutoDetalhe from "../../components/produtoDetalhe";
import ProdutoSlider from "../../components/produtoSlider";

export default function ProdutoDetalhePage({ params }) {
  // ⬅️ Next 15: params é uma Promise, precisa de React.use()
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const produtoId = Number(id);

  // Procura em todas as categorias
  const produto =
    produtos.find((p) => p.id === produtoId) ||
    arranjos.find((p) => p.id === produtoId);

  if (!produto) {
    return <h1>Produto não encontrado.</h1>;
  }

  return (
    <div>
      <ProdutoDetalhe
        id={produto.id} // essencial para carrinho
        nome={produto.nome}
        preco={produto.preco}
        descricao={produto.descricao}
        imagemPrincipal={produto.imagemPrincipal}
        imagemSecundaria={produto.imagemSecundaria}
        imagemTerciaria={produto.imagemTerciaria}
      />

      <ProdutoSlider />
    </div>
  );
}
