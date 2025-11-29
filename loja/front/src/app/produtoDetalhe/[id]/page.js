"use client";

import React from "react";
import { produtos } from "../../data/produtos"; // flores avulsas
import { arranjos } from "../../data/arranjos"; // arranjos e buquês
import ProdutoDetalhe from "../../components/produtoDetalhe";
import ProdutoSlider from "../../components/produtoSlider";

export default function ProdutoDetalhePage({ params }) {
  // ⬇️ NO NEXT 15, params É UMA PROMISE → PRECISA DE React.use()
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
        nome={produto.nome}
        preco={produto.preco}
        descricao={produto.descricao}
        imagemPrincipal={produto.imagemPrincipal}
        imagemSecundaria={produto.imagemSecundaria}
        imagemTerciaria={produto.imagemTerciaria}
        addToCart={() => alert(`Adicionado: ${produto.nome}`)}
      />

      <ProdutoSlider />
    </div>
  );
}
