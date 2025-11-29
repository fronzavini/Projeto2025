import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faReceipt } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/checkout.module.css";

// Componente para um único item do pedido (usado na lista de resumo)
const ItemResumo = ({ item }) => {
  return (
    <div className={styles.itemResumo}>
      <div>
        <p className={styles.nomeItemResumo}>{item.nome}</p>
        <p className={styles.vendidoPor}>
          Vendido por <strong>{item.vendidoPor}</strong> Enviado por{" "}
          <strong>{item.enviadoPor}</strong>
        </p>
      </div>
      <p className={styles.quantidadeItemResumo}>{item.quantidade}</p>
      <p className={styles.precoItemResumo}>{item.preco}</p>
    </div>
  );
};

// Componente principal da coluna lateral (Resumo do Pedido)
const ResumoPedidoLateral = ({
  itensPedido,
  enderecoEntrega,
  valoresTotais,
}) => {
  return (
    <div className={styles.containerResumoLateral}>
      {/* 1. Seção Cabeçalho e Endereço */}
      <div className={styles.cabecalhoLateral}>
        <h4>Endereço e resumo do pedido</h4>
      </div>

      <div className={styles.secaoEnderecoLateral}>
        <div className={styles.iconeTitulo}>
          <FontAwesomeIcon icon={faHouse} className={styles.iconeCasa} />
          <h5 className={styles.tituloSecao}>Endereço de entrega</h5>
        </div>

        <div className={styles.detalhesEnderecoLateral}>
          <p className={styles.nomeEnderecoLateral}>
            <input type="radio" checked readOnly className={styles.radio} />
            <strong>{enderecoEntrega.nome}</strong>, {enderecoEntrega.numero}
          </p>
          <p className={styles.linhaEndereco}>
            Casa - CEP {enderecoEntrega.cep} - {enderecoEntrega.cidade} -{" "}
            {enderecoEntrega.estado}
          </p>
          <p className={styles.linhaEndereco}>
            Principal - {enderecoEntrega.destinatario}
          </p>
        </div>

        <p className={styles.textoMudarEndereco}>
          Quer receber seu pedido em outro endereço?
        </p>
        <button className={styles.botaoUsarOutroEndereco}>
          USAR OUTRO ENDEREÇO
        </button>
      </div>

      {/* 2. Seção Resumo do Pedido */}
      <div className={styles.secaoResumoDetalhado}>
        <div className={styles.iconeTitulo}>
          <FontAwesomeIcon icon={faReceipt} className={styles.iconeRecibo} />
          <h5 className={styles.tituloSecao}>Resumo do pedido</h5>
        </div>

        <div className={styles.listaItensResumo}>
          <div className={styles.cabecalhoItensResumo}>
            <p>Itens do Pedido</p>
            <p>Qtde</p>
            <p>Preço</p>
          </div>
          {itensPedido.map((item, index) => (
            <ItemResumo key={index} item={item} />
          ))}
        </div>

        {/* Totais */}
        <div className={styles.linhaTotal}>
          <p className={styles.rotuloTotal}>Frete</p>
          <p className={styles.valorFrete}>{valoresTotais.frete}</p>
        </div>
        <div className={styles.linhaTotal}>
          <p className={styles.rotuloTotal}>Valor total</p>
          <p className={styles.montanteTotal}>{valoresTotais.montante}</p>
        </div>

        <div className={styles.linkRodape}>
          <a href="#termos">
            Clique aqui para ler o contrato de compra e venda
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumoPedidoLateral;
