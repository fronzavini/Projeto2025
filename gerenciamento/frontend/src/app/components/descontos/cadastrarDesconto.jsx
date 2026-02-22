import { useState, useEffect } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function CadastrarDesconto({ onClose }) {
  const [form, setForm] = useState({
    codigo: "",
    tipo: "fixo",
    descontofixo: 0,
    descontoPorcentagem: 0,
    descontofrete: 0,
    validade: "",
    aplicacao: "produto", // "produto" ou "tipo"
    produtoId: "",
    tipoProduto: "",
    estado: "ativo",
  });

  const [produtos, setProdutos] = useState([]);
  const [tiposProduto, setTiposProduto] = useState([]);

  const carregarProdutos = async () => {
    try {
      const response = await fetch("http://191.52.6.89:5000/listar_produtos", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Erro ao carregar produtos.");
      const resultado = await response.json();

      // Garante que é array
      const produtosArray = Array.isArray(resultado) ? resultado : [];
      const produtosFormatados = produtosArray.map((p) => ({
        id: p[0],
        nome: p[1],
        categoria: p[2], // Tipo do produto
        marca: p[3],
        preco: Number(p[4]),
        quantidade_estoque: p[5],
        estoque_minimo: p[6],
        estado: p[7],
        fornecedor_id: p[8],
        imagem: p[9] || "",
      }));

      // Extrai os tipos de produto únicos
      const tiposUnicos = [
        ...new Set(produtosFormatados.map((produto) => produto.categoria)),
      ];

      setProdutos(produtosFormatados);
      setTiposProduto(tiposUnicos);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProdutos([]); // evita quebrar a tabela
      setTiposProduto([]);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    // Formata a data no formato dd/mm/yyyy
    if (name === "validade") {
      const formattedValue = value
        .replace(/\D/g, "") // Remove caracteres não numéricos
        .replace(/(\d{2})(\d{2})/, "$1/$2") // Adiciona a barra após o dia
        .replace(/(\d{2}\/\d{2})(\d{4})/, "$1/$2"); // Adiciona a barra após o mês
      setForm((old) => ({ ...old, [name]: formattedValue }));
    } else {
      setForm((old) => ({ ...old, [name]: value }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converte a data para o formato yyyy-mm-dd antes de enviar ao backend
    const [dia, mes, ano] = form.validade.split("/");
    const validadeISO = `${ano}-${mes}-${dia}`;

    const descontoData = {
      ...form,
      validade: validadeISO,
      tipo: form.tipo === "fixo" ? "valor_fixo" : "percentual", // Corrige os valores enviados
      produto: form.aplicacao === "produto" ? form.produtoId : form.tipoProduto,
    };

    try {
      const response = await fetch("http://191.52.6.89:5000/criar_cupom", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(descontoData),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar desconto.");

      alert("Desconto cadastrado com sucesso!");
      onClose();

      setForm({
        codigo: "",
        tipo: "fixo",
        descontofixo: 0,
        descontoPorcentagem: 0,
        descontofrete: 0,
        validade: "",
        aplicacao: "produto",
        produtoId: "",
        tipoProduto: "",
        estado: "ativo",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar desconto.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Novo Desconto</h2>
        <button
          className={styles.botaoCancelar}
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="codigo" className={styles.label}>
            Nome do Desconto
          </label>
          <input
            className={styles.input}
            id="codigo"
            name="codigo"
            type="text"
            value={form.codigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="tipo"
              value="fixo"
              checked={form.tipo === "fixo"}
              onChange={handleChange}
              className={styles.radioInput}
            />
            Fixo
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="tipo"
              value="porcentagem"
              checked={form.tipo === "porcentagem"}
              onChange={handleChange}
              className={styles.radioInput}
            />
            Porcentagem
          </label>
        </div>

        {form.tipo === "fixo" && (
          <div className={styles.formGroup}>
            <label htmlFor="descontofixo" className={styles.label}>
              Valor do Desconto (R$)
            </label>
            <input
              className={styles.input}
              id="descontofixo"
              name="descontofixo"
              type="number"
              min="0"
              step="0.01"
              value={form.descontofixo}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {form.tipo === "porcentagem" && (
          <div className={styles.formGroup}>
            <label htmlFor="descontoPorcentagem" className={styles.label}>
              Desconto (%)
            </label>
            <input
              className={styles.input}
              id="descontoPorcentagem"
              name="descontoPorcentagem"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.descontoPorcentagem}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="validade" className={styles.label}>
            Validade
          </label>
          <input
            className={styles.input}
            id="validade"
            name="validade"
            type="text"
            placeholder="dd/mm/yyyy"
            value={form.validade}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Aplicar em:</label>
          <select
            className={styles.select}
            name="aplicacao"
            value={form.aplicacao}
            onChange={handleChange}
          >
            <option value="produto">Produto</option>
            <option value="tipo">Tipo de Produto</option>
          </select>
        </div>

        {form.aplicacao === "produto" && (
          <div className={styles.formGroup}>
            <label htmlFor="produtoId" className={styles.label}>
              Produto
            </label>
            <select
              className={styles.select}
              id="produtoId"
              name="produtoId"
              value={form.produtoId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.aplicacao === "tipo" && (
          <div className={styles.formGroup}>
            <label htmlFor="tipoProduto" className={styles.label}>
              Tipo de Produto
            </label>
            <select
              className={styles.select}
              id="tipoProduto"
              name="tipoProduto"
              value={form.tipoProduto}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um tipo de produto</option>
              {tiposProduto.map((tipo, index) => (
                <option key={index} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className={styles.botaoEnviar}>
          Cadastrar Desconto
        </button>
      </form>
    </div>
  );
}
