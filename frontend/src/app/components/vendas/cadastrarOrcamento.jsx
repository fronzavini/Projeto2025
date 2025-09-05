"use client";
import { useState } from "react";
import styles from "../../styles/cadastrarVenda.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function CadastrarOrcamento({ onClose }) {
  const [produtos, setProdutos] = useState([
    { nome: "Buquê de rosas", quantidade: 1, valorUnit: 98.77 },
    { nome: "Girassol", quantidade: 2, valorUnit: 10.5 },
  ]);
  const [novoProduto, setNovoProduto] = useState({ nome: "", valorUnit: 0 });
  const [tipoEntrega, setTipoEntrega] = useState("entrega");
  const [formaPagamento, setFormaPagamento] = useState("Pix");

  const subtotal = produtos.reduce(
    (acc, p) => acc + p.valorUnit * p.quantidade,
    0
  );

  const handleRemover = (index) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const handleQuantidade = (index, delta) => {
    const novos = [...produtos];
    novos[index].quantidade = Math.max(1, novos[index].quantidade + delta);
    setProdutos(novos);
  };

  const handleAdicionarProduto = () => {
    if (novoProduto.nome && novoProduto.valorUnit > 0) {
      setProdutos([...produtos, { ...novoProduto, quantidade: 1 }]);
      setNovoProduto({ nome: "", valorUnit: 0 });
    }
  };

  const [cliente, setCliente] = useState(null);
  const [clienteBusca, setClienteBusca] = useState("");

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Novo orçamento</h2>
          <button className={styles.cancelar} onClick={onClose}>
            Cancelar
          </button>
        </div>

        <label className={styles.titulo}>Cliente</label>
        <div className={styles.inlineSearch}>
          <div className={styles.inputIconWrapper}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={styles.inputIcon}
            />
            <input
              className={styles.input}
              placeholder="Buscar Cliente"
              value={clienteBusca}
              onChange={(e) => setClienteBusca(e.target.value)}
            />
          </div>

          <button
            className={styles.botaoRoxo}
            onClick={() => {
              if (clienteBusca.trim() !== "") {
                setCliente(clienteBusca.trim());
                setClienteBusca("");
              }
            }}
          >
            Adicionar
          </button>
        </div>

        {cliente && (
          <div className={styles.clienteSelecionado}>
            <span>
              Cliente selecionado: <strong>{cliente}</strong>
            </span>
            <button
              className={styles.removerCliente}
              onClick={() => setCliente(null)}
              title="Remover cliente"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

        <h3 className={styles.titulo}>Produtos</h3>

        <label>Novo Produto</label>
        <div className={styles.novoProdutoForm}>
          <input
            placeholder="Nome"
            value={novoProduto.nome}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, nome: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Valor Unitário"
            value={novoProduto.valorUnit}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue === "") {
                setNovoProduto({ ...novoProduto, valorUnit: "" });
                return;
              }
              const valor = parseFloat(inputValue);
              if (!isNaN(valor) && valor >= 0) {
                setNovoProduto({ ...novoProduto, valorUnit: valor });
              }
            }}
          />
          <button className={styles.botaoRoxo} onClick={handleAdicionarProduto}>
            Adicionar Produto
          </button>
        </div>

        <div className={styles.produtoContainer}>
          <div className={styles.headerProdutos}>
            <span>Produto</span>
            <span>Quantidade</span>
            <span>Valor Unit.</span>
            <span>Valor</span>
            <span></span>
          </div>

          {produtos.map((produto, index) => (
            <div key={index} className={styles.produtoItem}>
              <span>{produto.nome}</span>
              <div className={styles.quantidadeControls}>
                <button onClick={() => handleQuantidade(index, -1)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span>{produto.quantidade}</span>
                <button onClick={() => handleQuantidade(index, 1)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <span>R${produto.valorUnit.toFixed(2)}</span>
              <span>
                R${(produto.valorUnit * produto.quantidade).toFixed(2)}
              </span>
              <button
                className={styles.trashButton}
                onClick={() => handleRemover(index)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>R${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <label className={styles.titulo}>Adicionar Cupom</label>
        <div className={styles.inlineSearch}>
          <div className={styles.inputIconWrapper}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={styles.inputIcon}
            />
            <input className={styles.input} placeholder="Buscar Cupom" />
          </div>
          <button className={styles.botaoRoxo}>Aplicar</button>
        </div>

        <div className={styles.resumo}>
          <div className={styles.resumoItem}>
            <span>Subtotal</span>
            <span className={styles.valorDireita}>R${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.resumoItem}>
            <span>Desconto</span>
            <span className={styles.valorDireita}>R$00,00</span>
          </div>
          <div className={styles.resumoItem}>
            <span>Total</span>
            <span className={styles.valorDireita}>R${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <label className={styles.titulo}>Forma de Pagamento</label>
        <select
          className={styles.select}
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
        >
          <option>Pix</option>
          <option>Espécie</option>
        </select>

        <div className={styles.entregaBox}>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="entrega"
                checked={tipoEntrega === "entrega"}
                onChange={() => setTipoEntrega("entrega")}
              />
              Entrega
            </label>
            <label>
              <input
                type="radio"
                value="retirada"
                checked={tipoEntrega === "retirada"}
                onChange={() => setTipoEntrega("retirada")}
              />
              Retirada
            </label>
          </div>

          {tipoEntrega === "entrega" && (
            <div className={styles.entregaCampos}>
              <div className={styles.row}>
                <label className={styles.labelCinza}>Endereço da entrega</label>
                <input type="text" className={styles.inputEntrega} />
              </div>
              <div className={styles.row}>
                <label className={styles.labelCinza}>Data da entrega</label>
                <input type="date" className={styles.inputEntrega} />
              </div>
              <div className={styles.row}>
                <label className={styles.labelCinza}>Frete</label>
                <span className={styles.valorDireita}>R$00,00</span>
              </div>
            </div>
          )}
        </div>

        <button className={styles.confirmarVenda}>Cadastrar orçamento</button>
      </div>
    </div>
  );
}
