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

export default function EditarOrcamento({ onClose, orcamento }) {
  // Converte itensVendidos para Produto (com valorUnit numérico)
  const [produtos, setProdutos] = useState(
    orcamento.itensVendidos.map((item) => ({
      nome: item.nome,
      quantidade: item.quantidade,
      valorUnit: parseFloat(item.valorUnitario) || 0,
    }))
  );

  const [novoProduto, setNovoProduto] = useState({ nome: "", valorUnit: 0 });
  const [cliente, setCliente] = useState(orcamento.nomeCliente || "");
  const [clienteBusca, setClienteBusca] = useState("");

  const [tipoEntrega, setTipoEntrega] = useState(
    orcamento.formaEntrega || "Entrega"
  );
  const [formaPagamento, setFormaPagamento] = useState(
    orcamento.formaPagamento || "Pix"
  );
  const [enderecoEntrega, setEnderecoEntrega] = useState(
    orcamento.localEntrega || ""
  );
  const [dataEntrega, setDataEntrega] = useState(orcamento.dataEntrega || "");
  const [frete, setFrete] = useState(0);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const orcamentoAtualizado = {
      ...orcamento,
      nomeCliente: cliente,
      itensVendidos: produtos.map((p) => ({
        nome: p.nome,
        quantidade: p.quantidade,
        valorUnitario: p.valorUnit.toFixed(2),
        valorTotal: (p.valorUnit * p.quantidade).toFixed(2),
      })),
      formaEntrega: tipoEntrega,
      formaPagamento: formaPagamento,
      localEntrega: tipoEntrega === "Entrega" ? enderecoEntrega : "",
      dataEntrega: tipoEntrega === "Entrega" ? dataEntrega : "",
      subtotal: subtotal.toFixed(2),
      desconto: "0.00",
      valorTotal: (subtotal + frete).toFixed(2),
      idpedido: orcamento.idpedido,
      cpfcliente: orcamento.cpfcliente,
      dataVenda: orcamento.dataVenda,
      status: orcamento.status,
    };

    console.log("Orçamento atualizado:", orcamentoAtualizado);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Editar Orçamento</h2>
          <button className={styles.cancelar} onClick={onClose}>
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
              type="button"
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
                type="button"
                className={styles.removerCliente}
                onClick={() => setCliente("")}
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
                  setNovoProduto({ ...novoProduto, valorUnit: 0 });
                  return;
                }
                const valor = parseFloat(inputValue);
                if (!isNaN(valor) && valor >= 0) {
                  setNovoProduto({ ...novoProduto, valorUnit: valor });
                }
              }}
            />
            <button
              type="button"
              className={styles.botaoRoxo}
              onClick={handleAdicionarProduto}
            >
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
                  <button
                    type="button"
                    onClick={() => handleQuantidade(index, -1)}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span>{produto.quantidade}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantidade(index, 1)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <span>R${produto.valorUnit.toFixed(2)}</span>
                <span>
                  R${(produto.valorUnit * produto.quantidade).toFixed(2)}
                </span>
                <button
                  type="button"
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
            <button type="button" className={styles.botaoRoxo}>
              Aplicar
            </button>
          </div>

          <div className={styles.resumo}>
            <div className={styles.resumoItem}>
              <span>Subtotal</span>
              <span className={styles.valorDireita}>
                R${subtotal.toFixed(2)}
              </span>
            </div>
            <div className={styles.resumoItem}>
              <span>Desconto</span>
              <span className={styles.valorDireita}>R$00,00</span>
            </div>
            <div className={styles.resumoItem}>
              <span>Total</span>
              <span className={styles.valorDireita}>
                R${(subtotal + frete).toFixed(2)}
              </span>
            </div>
          </div>

          <label className={styles.titulo}>Forma de Pagamento</label>
          <select
            className={styles.select}
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          >
            <option value="Pix">Pix</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Espécie">Espécie</option>
          </select>

          <div className={styles.entregaBox}>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  value="Entrega"
                  checked={tipoEntrega === "Entrega"}
                  onChange={() => setTipoEntrega("Entrega")}
                />
                Entrega
              </label>
              <label>
                <input
                  type="radio"
                  value="Retirada"
                  checked={tipoEntrega === "Retirada"}
                  onChange={() => setTipoEntrega("Retirada")}
                />
                Retirada
              </label>
            </div>

            {tipoEntrega === "Entrega" && (
              <div className={styles.entregaCampos}>
                <div className={styles.row}>
                  <label className={styles.labelCinza}>
                    Endereço da entrega
                  </label>
                  <input
                    type="text"
                    className={styles.inputEntrega}
                    value={enderecoEntrega}
                    onChange={(e) => setEnderecoEntrega(e.target.value)}
                  />
                </div>
                <div className={styles.row}>
                  <label className={styles.labelCinza}>Data da entrega</label>
                  <input
                    type="date"
                    className={styles.inputEntrega}
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                  />
                </div>
                <div className={styles.row}>
                  <label className={styles.labelCinza}>Frete</label>
                  <input
                    type="number"
                    className={styles.inputEntrega}
                    value={frete}
                    min={0}
                    step={0.01}
                    onChange={(e) => setFrete(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          <button type="submit" className={styles.confirmarVenda}>
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
}
