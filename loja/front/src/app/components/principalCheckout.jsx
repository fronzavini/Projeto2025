import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/checkout.module.css";

const PrincipalCheckout = ({ itens, valoresTotais }) => {
  const item = itens?.[0] || {};

  return (
    <div className={styles.containerPrincipal}>
      {/* 1. Seleção do Tipo de Entrega */}
      <div className={styles.secaoEntrega}>
        <h3 className={styles.tituloSecaoPrincipal}>
          Selecione o tipo de entrega
        </h3>

        <div className={styles.detalhesItemEntrega}>
          <div className={styles.vendedor}>
            Vendido por <strong>{item.vendidoPor || "Loja"}</strong> e Enviado
            por <strong>{item.enviadoPor || "Loja"}</strong>
          </div>

          <div className={styles.infoProdutoFrete}>
            <div className={styles.blocoImagem}>
              <img
                src={item.imagem || "/placeholder.png"}
                alt={item.nome || "Produto"}
              />
            </div>

            <div className={styles.detalhesProduto}>
              <p className={styles.nomeProduto}>{item.nome || "Produto"}</p>
              <p>
                Cor: <strong>{item.cor || "Padrão"}</strong>
              </p>
              <p>
                Tamanho: <strong>{item.tamanho || "Único"}</strong>
              </p>
            </div>

            <div className={styles.opcoesFrete}>
              <div className={styles.opcaoFrete}>
                <input type="radio" name="frete" defaultChecked />
                <span className={styles.rotuloFreteNormal}>Normal:</span>
                <span className={styles.valorFreteGratis}>Grátis</span>
                <span className={styles.dataEntrega}>
                  Chega dia 23 de Dezembro
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pagamento com Pix */}
      <div className={styles.secaoPagamento}>
        <h3 className={styles.tituloPagamento}>
          <FontAwesomeIcon
            icon={faMoneyBillTransfer}
            className={styles.iconePix}
          />{" "}
          Pagar com Pix
        </h3>

        <p className={styles.valorPagamento}>
          R${" "}
          {Number(valoresTotais.total || 0)
            .toFixed(2)
            .replace(".", ",")}
        </p>

        <button className={styles.botaoFinalizar}>FINALIZAR PEDIDO</button>
      </div>
    </div>
  );
};

export default PrincipalCheckout;
