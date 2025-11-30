"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProdutoDetalhe from "../../components/produtoDetalhe";
import ProdutoSlider from "@/app/components/produtoSlider";

export default function ProdutoDetalhePage() {
  const params = useParams(); // pega os params da URL
  const { id } = params; // id do produto
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/produto_id/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduto(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchProduto();
  }, [id]);

  if (carregando) return <p>Carregando produto...</p>;
  if (!produto) return <h1>Produto não encontrado</h1>;

  return (
    <div>
      <ProdutoDetalhe
        id={produto.id}
        nome={produto.nome}
        preco={produto.preco}
        descricao={produto.descricao || "Sem descrição"}
        imagemPrincipal={produto.imagem_1}
        imagemSecundaria={produto.imagem_2}
        imagemTerciaria={produto.imagem_3}
      />

      <ProdutoSlider />
    </div>
  );
}
