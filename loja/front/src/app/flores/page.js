"use client";

import Produto from "../components/produto";

export default function Home() {
  const handleAddToCart = (produto) => {
    alert(`Produto adicionado: ${produto.nome}`);
  };

  return (
    <>
      <Produto
        nome="Copo-de-Leite - Flor Unitária"
        imagemPrincipal="/imgs/copo-de-leite.jpg"
        preco="10,00"
        addToCart={handleAddToCart}
      />
    </>
  );
}
