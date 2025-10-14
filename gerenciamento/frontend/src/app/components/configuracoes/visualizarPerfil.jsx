import styles from "../../styles/perfis.module.css";

export default function VisualizarPerfil({ perfil, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Perfil: {perfil.nome}</h2>
          <button className={styles.botaoCancelar} onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>Permissões</label>
          <div>{perfil.permissoes}</div>
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>
          <div>{perfil.ativo ? "Ativo" : "Inativo"}</div>
        </div>

        <div className={styles.actions}>
          <button className={styles.botaoCancelar} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
