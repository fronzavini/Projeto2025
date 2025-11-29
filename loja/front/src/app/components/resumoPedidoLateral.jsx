"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faReceipt } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/checkout.module.css";
import { useCarrinho } from "../context/carrinhoContext";

// Componente para um único item do pedido
const ItemResumo = ({ item }) => {
  return (
    <div className={styles.itemResumo}>
      <div>
        <p className={styles.nomeItemResumo}>{item.nome}</p>
      </div>
      <p className={styles.quantidadeItemResumo}>{item.quantidade}</p>
      <p className={styles.precoItemResumo}>
        R$ {Number(item.preco).toFixed(2).replace(".", ",")}
      </p>
    </div>
  );
};

// Componente principal da coluna lateral
const ResumoPedidoLateral = () => {
  const { dadosCheckout, atualizarEndereco } = useCarrinho();
  const { itensPedido, enderecoEntrega, valoresTotais } = dadosCheckout;

  const [novoEndereco, setNovoEndereco] = useState({
    nome: "",
    numero: "",
    cep: "",
    cidade: "",
    estado: "",
    destinatario: "",
  });
  const [mostraFormulario, setMostraFormulario] = useState(false);

  const handleChange = (e) => {
    setNovoEndereco({ ...novoEndereco, [e.target.name]: e.target.value });
  };

  const handleSalvarEndereco = (e) => {
    e.preventDefault();
    if (!novoEndereco.nome || !novoEndereco.cep) {
      alert("Preencha os campos obrigatórios!");
      return;
    }
    atualizarEndereco(novoEndereco);
    setMostraFormulario(false);
  };

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

        {enderecoEntrega && enderecoEntrega.nome && !mostraFormulario ? (
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
        ) : null}

        {mostraFormulario && (
          <form
            className={styles.formNovoEndereco}
            onSubmit={handleSalvarEndereco}
          >
            <input
              type="text"
              name="nome"
              placeholder="Nome do endereço"
              value={novoEndereco.nome}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="numero"
              placeholder="Número"
              value={novoEndereco.numero}
              onChange={handleChange}
            />
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              value={novoEndereco.cep}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cidade"
              placeholder="Cidade"
              value={novoEndereco.cidade}
              onChange={handleChange}
            />
            <input
              type="text"
              name="estado"
              placeholder="Estado"
              value={novoEndereco.estado}
              onChange={handleChange}
            />
            <input
              type="text"
              name="destinatario"
              placeholder="Destinatário"
              value={novoEndereco.destinatario}
              onChange={handleChange}
            />
            <button type="submit" className={styles.botaoSalvarEndereco}>
              Salvar Endereço
            </button>
          </form>
        )}

        <p className={styles.textoMudarEndereco}>
          Quer receber seu pedido em outro endereço?
        </p>
        <button
          className={styles.botaoUsarOutroEndereco}
          onClick={() => setMostraFormulario(!mostraFormulario)}
        >
          {mostraFormulario ? "Cancelar" : "USAR OUTRO ENDEREÇO"}
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
          {itensPedido && itensPedido.length > 0 ? (
            itensPedido.map((item) => <ItemResumo key={item.id} item={item} />)
          ) : (
            <p>Seu carrinho está vazio.</p>
          )}
        </div>

        {/* Totais */}
        <div className={styles.linhaTotal}>
          <p className={styles.rotuloTotal}>Frete</p>
          <p className={styles.valorFrete}>{valoresTotais.frete}</p>
        </div>
        <div className={styles.linhaTotal}>
          <p className={styles.rotuloTotal}>Valor total</p>
          <p className={styles.montanteTotal}>
            R${" "}
            {Number(valoresTotais.total || 0)
              .toFixed(2)
              .replace(".", ",")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumoPedidoLateral;
