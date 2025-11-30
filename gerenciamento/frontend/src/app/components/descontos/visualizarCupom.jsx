import React, { useEffect, useState } from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarCupom({ onClose, cupom }) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // formata YYYY-MM-DD -> dd/mm/yyyy
  const formatarData = (iso) => {
    if (!iso) return "";
    if (iso.includes("/")) return iso;
    const p = iso.split("-");
    if (p.length !== 3) return iso;
    return `${p[2]}/${p[1]}/${p[0]}`;
  };

  useEffect(() => {
    let ignore = false;

    async function buscarCupom() {
      if (!cupom) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:5000/listar_cupons");
        if (!res.ok) throw new Error("Erro ao buscar cupons.");

        const lista = await res.json();

        const encontrado =
          lista.find((c) =>
            cupom.id ? Number(c.id) === Number(cupom.id) : false
          ) ||
          lista.find((c) =>
            cupom.codigo && c.codigo
              ? c.codigo.toString() === cupom.codigo.toString()
              : false
          );

        if (!ignore) {
          if (!encontrado) {
            setError("Cupom não encontrado.");
            setDados(null);
            return;
          }

          setDados({
            ...encontrado,
            validade: formatarData(encontrado.validade),
            estado:
              encontrado.estado === true ||
              encontrado.estado === "ativo" ||
              encontrado.estado === 1
                ? "Ativo"
                : "Inativo",
          });
        }
      } catch (err) {
        if (!ignore) {
          setError("Erro ao carregar os dados do cupom.");
          setDados(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    buscarCupom();
    return () => (ignore = true);
  }, [cupom]);

  // --------------------------
  // FUNÇÃO PARA DESCOBRIR O TIPO DE APLICAÇÃO DO CUPOM
  // --------------------------
  const getDestinoCupom = () => {
    if (!dados) return null;

    // 1. Cupom por tipo de produto
    if (dados.tipo_produto && dados.tipo_produto.trim() !== "") {
      return {
        tipo: "tipo_produto",
        label: "Cupom aplicado ao tipo de produto",
        valor: dados.tipo_produto,
      };
    }

    // 2. Cupom por produto específico
    if (dados.produto_nome) {
      return {
        tipo: "produto",
        label: "Cupom aplicado ao produto específico",
        valor: dados.produto_nome,
      };
    }

    if (dados.produto_id) {
      return {
        tipo: "produto",
        label: "Cupom aplicado ao produto (ID)",
        valor: `ID: ${dados.produto_id}`,
      };
    }

    // 3. Cupom global
    return {
      tipo: "global",
      label: "Cupom válido para todos os produtos",
      valor: "",
    };
  };

  const destino = getDestinoCupom();

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>
              Cupom: {dados?.codigo || ""}
            </h2>

            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <form>
            {loading && <p>Carregando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && dados && (
              <>
                {/* Código */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Código</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={dados.codigo}
                    disabled
                  />
                </div>

                {/* Tipo percentual ou fixo */}
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      value="valor_fixo"
                      checked={dados.tipo === "valor_fixo"}
                      disabled
                    />
                    Valor Fixo
                  </label>

                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      value="percentual"
                      checked={dados.tipo === "percentual"}
                      disabled
                    />
                    Percentual
                  </label>
                </div>

                {/* Descontos */}
                <div className={styles.row}>
                  {dados.tipo === "valor_fixo" && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Desconto Fixo (R$)</label>
                      <input
                        className={styles.input}
                        type="number"
                        value={dados.descontofixo || 0}
                        disabled
                      />
                    </div>
                  )}

                  {dados.tipo === "percentual" && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Desconto Percentual (%)
                      </label>
                      <input
                        className={styles.input}
                        type="number"
                        value={dados.descontoPorcentagem || 0}
                        disabled
                      />
                    </div>
                  )}
                </div>

                {/* Frete */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Desconto no Frete</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={dados.descontofrete || 0}
                    disabled
                  />
                </div>

                {/* ----------------------------
                    CAMPO INTELIGENTE DE DESTINO
                  ---------------------------- */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {destino.label}
                  </label>

                  <input
                    className={styles.input}
                    type="text"
                    value={destino.valor}
                    disabled
                  />
                </div>

                {/* Valor mínimo */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Valor mínimo (R$)</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={dados.valor_minimo || 0}
                    disabled
                  />
                </div>

                {/* Validade */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Validade</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={dados.validade}
                    disabled
                  />
                </div>

                {/* Usos */}
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Usos Permitidos</label>
                    <input
                      className={styles.input}
                      type="number"
                      value={dados.usos_permitidos || 0}
                      disabled
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Usos Realizados</label>
                    <input
                      className={styles.input}
                      type="number"
                      value={dados.usos_realizados || 0}
                      disabled
                    />
                  </div>
                </div>

                {/* Estado */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={dados.estado}
                    disabled
                  />
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
