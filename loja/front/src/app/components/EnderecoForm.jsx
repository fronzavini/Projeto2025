"use client";
import styles from "../styles/perfil.module.css";

export default function EnderecoForm() {
  return (
    <div className={styles.perfilForm}>
      <h2>Endereço</h2>

      <form>
        {/* Linha 1 - CEP e Rua */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>CEP</label>
            <input type="text" placeholder="00000-000" />
          </div>

          <div className={styles.col}>
            <label>Rua</label>
            <input type="text" placeholder="Sua rua" />
          </div>
        </div>

        {/* Linha 2 - Número e Bairro */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>Número</label>
            <input type="text" placeholder="000" />
          </div>

          <div className={styles.col}>
            <label>Bairro</label>
            <input type="text" placeholder="Bairro" />
          </div>
        </div>

        {/* Linha 3 - Cidade e Estado */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>Cidade</label>
            <input type="text" placeholder="Cidade" />
          </div>

          <div className={styles.col}>
            <label>Estado</label>
            <select>
              <option>Selecione</option>
              <option>SC</option>
              <option>PR</option>
              <option>RS</option>
            </select>
          </div>
        </div>

        <button type="submit">Salvar Endereço</button>
      </form>
    </div>
  );
}
