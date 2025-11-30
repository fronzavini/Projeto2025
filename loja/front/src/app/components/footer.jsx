"use client";
import styles from "../styles/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        {/* Logo / Nome */}
        <div className={styles.section}>
          <h2 className={styles.logo}>BellaDonna</h2>
          <p className={styles.desc}>
            Produtos selecionados com carinho para você.
          </p>
        </div>

        {/* Links */}
        <div className={styles.section}>
          <h3>Links rápidos</h3>
          <ul>
            <li>
              <a href="/sobre">Sobre nós</a>
            </li>
            <li>
              <a href="/flores">Flores</a>
            </li>
            <li>
              <a href="/arranjos">Arranjos</a>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div className={styles.section}>
          <h3>Contato</h3>
          <p>Email: atendimento@BellaDonna.com</p>
          <p>WhatsApp: (47) 99999-9999</p>
          <p>Indaial - SC</p>
        </div>
      </div>

      <div className={styles.copy}>
        © {new Date().getFullYear()} BellaDonna — Todos os direitos reservados
      </div>
    </footer>
  );
}
