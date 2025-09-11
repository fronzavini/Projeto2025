import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/configuracoes.module.css";

export default function InicializacaoCard({
  abrirComSistema,
  setAbrirComSistema,
  restaurarSessao,
  setRestaurarSessao,
}) {
  return (
    <section className={styles.section}>
      <h3>
        <FontAwesomeIcon icon={faRocket} className={styles.icone} />{" "}
        Inicialização
      </h3>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={abrirComSistema}
          onChange={() => setAbrirComSistema(!abrirComSistema)}
        />
        Abrir sistema automaticamente
      </label>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={restaurarSessao}
          onChange={() => setRestaurarSessao(!restaurarSessao)}
        />
        Restaurar última sessão
      </label>
    </section>
  );
}
