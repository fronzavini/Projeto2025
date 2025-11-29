"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Para navegação
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/checkout.module.css";
import ResumoPedidoLateral from "../components/resumoPedidoLateral";
import PrincipalCheckout from "../components/principalCheckout";
import { useCarrinho } from "../context/carrinhoContext";

const Checkout = () => {
  const router = useRouter();

  const { dadosCheckout } = useCarrinho();

  // Se não houver dados do pedido
  if (!dadosCheckout || !dadosCheckout.itensPedido) {
    return (
      <div className={styles.containerGeral}>
        <p className="text-center text-gray-500 p-8">
          <FontAwesomeIcon icon={faShoppingCart} /> Carregando dados do pedido
          ou <strong>carrinho vazio</strong>...
        </p>
      </div>
    );
  }

  // Função real de voltar
  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };

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
            itens={dadosCheckout.itensPedido}
            valoresTotais={dadosCheckout.valoresTotais}
          />
        </div>
        <div className={styles.colunaLateral}>
          <ResumoPedidoLateral
            itensPedido={dadosCheckout.itensPedido}
            enderecoEntrega={dadosCheckout.enderecoEntrega}
            valoresTotais={dadosCheckout.valoresTotais}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
