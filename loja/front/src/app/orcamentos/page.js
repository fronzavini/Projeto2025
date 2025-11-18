"use client";

import React from "react";
import Produto from "../components/produto";
import Banner from "../components/banner";
import Filtro from "../components/filtro";
import Relevancia from "../components/relevancia";
import styles from "../styles/page.module.css";
import ProdutoDetalhe from "../components/produtoDetalhe";

export default function Orcamentos() {
  const florProduto = {
    nome: "Copo-de-Leite – Flor Unitária",
    preco: 10.0,
    imagemPrincipal:
      "https://www.uniflores.com.br/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/b/u/buqu_-de-flores-tradition-com-18-rosas.jpg",
    imagemSecundaria:
      "https://pf01.cdn.imgeng.in/foto_producto/abundante_amor_109810_mexico_grande_720.jpg",
    imagemTerciaria:
      "https://mercadojamaicaonline.com/cdn/shop/products/SV-Azap_0001_Capa2_0001_Capa2.jpg?v=1691420353&width=1946",
    descricao:
      "Elegante e sofisticado, o Copo-de-Leite é uma flor clássica que transmite pureza e delicadeza. Perfeita para decoração, buquês minimalistas ou arranjos especiais, cada unidade é cuidadosamente selecionada para garantir frescor e beleza.",
  };

  const handleAddToCart = () => {
    alert(`Produto "${florProduto.nome}" adicionado à sacola!`);
  };

  return (
    <div>
      <ProdutoDetalhe
        // Props de Imagens
        imagemPrincipal={florProduto.imagemPrincipal}
        imagemSecundaria={florProduto.imagemSecundaria}
        imagemTerciaria={florProduto.imagemTerciaria}
        // Props de Informação
        nome={florProduto.nome}
        preco={florProduto.preco}
        descricao={florProduto.descricao}
        // Prop de Ação (função)
        addToCart={handleAddToCart}
      />
    </div>
  );
}
