import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/checkout.module.css";

const PrincipalCheckout = ({ itens, valoresTotais }) => {
  const item = itens[0]; // Assumindo um único produto para simplificação

  return (
    <div className={styles.containerPrincipal}>
      {/* 1. Seleção do Tipo de Entrega */}
      <div className={styles.secaoEntrega}>
        <h3 className={styles.tituloSecaoPrincipal}>
          Selecione o tipo de entrega
        </h3>

        <div className={styles.detalhesItemEntrega}>
          <div className={styles.vendedor}>
            Vendido por <strong>{item.vendidoPor}</strong> e Enviado por{" "}
            <strong>{item.enviadoPor}</strong>
          </div>

          <div className={styles.infoProdutoFrete}>
            <div className={styles.blocoImagem}>[Imagem do Produto]</div>

            <div className={styles.detalhesProduto}>
              <p className={styles.nomeProduto}>{item.nome}</p>
              <p>
                Cor: <strong>{item.cor}</strong>
              </p>
              <p>
                Tamanho: <strong>{item.tamanho}</strong>
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

        <div className={styles.aprovacao}>Aprovação em minutos</div>

        <p className={styles.valorPagamento}>{valoresTotais.montante}</p>

        <ol className={styles.passosPix}>
          <li>
            Após a finalização do pedido, abra o app ou banco de sua
            preferência. Escolha a opção pagar com código Pix "copia e cola", ou
            código QR. O código tem validade de 2 horas.
          </li>
          <li>
            Copie e cole o código, ou escaneie o código QR com a câmera do seu
            celular. Confira todas as informações e autorize o pagamento.
          </li>
          <li>
            Você vai receber a confirmação de pagamento no seu e-mail e através
            dos nossos canais. É pronto!
          </li>
        </ol>

        <button className={styles.botaoFinalizar}>
          FINALIZAR PEDIDO COM PIX
        </button>
      </div>
    </div>
  );
};

export default PrincipalCheckout;
