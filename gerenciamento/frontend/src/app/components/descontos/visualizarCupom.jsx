import React from "react";
import styles from "../../styles/cadastrarCliente.module.css";

export default function VisualizarCupom({ onClose, cupom }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Cupom: {cupom.codigo || ""}</h2>
            <button
              className={styles.botaoCancelar}
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <form>
            {/* Nome do Cupom */}
            <div className={styles.formGroup}>
              <label htmlFor="nome" className={styles.label}>
                Nome do cupom
              </label>
              <input
                className={styles.input}
                id="nome"
                name="nome"
                type="text"
                value={cupom.nome || ""}
                disabled
              />
            </div>

            {/* Tipo do Cupom */}
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="fixo"
                  checked={cupom.tipo === "fixo"}
                  className={styles.radioInput}
                  disabled
                />
                Fixo
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="porcentagem"
                  checked={cupom.tipo === "porcentagem"}
                  className={styles.radioInput}
                  disabled
                />
                Porcentagem
              </label>
            </div>

            {/* Valores */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="valorDesconto" className={styles.label}>
                  Valor do desconto
                </label>
                <input
                  className={styles.input}
                  id="valorDesconto"
                  name="valorDesconto"
                  type="number"
                  value={cupom.valorDesconto ?? 0}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="valorMaximoDesconto" className={styles.label}>
                  Valor máximo de desconto
                </label>
                <input
                  className={styles.input}
                  id="valorMaximoDesconto"
                  name="valorMaximoDesconto"
                  type="number"
                  value={cupom.valorMaximoDesconto ?? 0}
                  disabled
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="valorMinimoCompra" className={styles.label}>
                Valor mínimo da compra
              </label>
              <input
                className={styles.input}
                id="valorMinimoCompra"
                name="valorMinimoCompra"
                type="number"
                value={cupom.valorMinimoCompra ?? 0}
                disabled
              />
            </div>

            {/* Categoria */}
            <div className={styles.formGroup}>
              <label htmlFor="categoria" className={styles.label}>
                Categoria
              </label>
              <input
                className={styles.input}
                id="categoria"
                name="categoria"
                type="text"
                value={cupom.categoria || ""}
                disabled
              />
            </div>

            {/* Datas */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="dataInicio" className={styles.label}>
                  Data de início
                </label>
                <input
                  className={styles.input}
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  value={cupom.dataInicio || ""}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dataTermino" className={styles.label}>
                  Data de término
                </label>
                <input
                  className={styles.input}
                  id="dataTermino"
                  name="dataTermino"
                  type="date"
                  value={cupom.dataTermino || ""}
                  disabled
                />
              </div>
            </div>

            {/* Produto */}
            <div className={styles.formGroup}>
              <label htmlFor="produto" className={styles.label}>
                Produto
              </label>
              <input
                className={styles.input}
                id="produto"
                name="produto"
                type="text"
                value={cupom.produto || ""}
                disabled
              />
            </div>

            {/* Estado */}
            <div className={styles.formGroup}>
              <label htmlFor="estado" className={styles.label}>
                Estado
              </label>
              <input
                className={styles.input}
                id="estado"
                name="estado"
                type="text"
                value={cupom.estado || ""}
                disabled
              />
            </div>

            {/* Desconto de Frete */}
            <div className={styles.formGroup}>
              <label htmlFor="descontoFrete" className={styles.label}>
                Desconto de Frete
              </label>
              <input
                className={styles.input}
                id="descontoFrete"
                name="descontoFrete"
                type="text"
                value={cupom.descontofrete || ""}
                disabled
              />
            </div>

            {/* Descrição */}
            <div className={styles.formGroup}>
              <label htmlFor="descricao" className={styles.label}>
                Descrição
              </label>
              <textarea
                className={styles.input}
                id="descricao"
                name="descricao"
                value={cupom.descricao || ""}
                disabled
              />
            </div>

            {/* Usos */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="usosPermitidos" className={styles.label}>
                  Usos permitidos
                </label>
                <input
                  className={styles.input}
                  id="usosPermitidos"
                  name="usosPermitidos"
                  type="number"
                  value={cupom.usos_permitidos ?? 0}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="usosRealizados" className={styles.label}>
                  Usos realizados
                </label>
                <input
                  className={styles.input}
                  id="usosRealizados"
                  name="usosRealizados"
                  type="number"
                  value={cupom.usos_realizados ?? 0}
                  disabled
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
