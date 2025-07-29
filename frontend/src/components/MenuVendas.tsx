import { NavLink } from "react-router-dom";
import styles from "../styles/MenuVendas.module.css";

export default function MenuVendas() {
  return (
    <div className={styles.menuvendas}>
      <ul className={styles.menuLista}>
        <li>
          <NavLink
            to="balcao"
            className={({ isActive }) => (isActive ? styles.ativo : "")}
          >
            Balcão
          </NavLink>
        </li>
        <li>
          <NavLink
            to="encomendas"
            className={({ isActive }) => (isActive ? styles.ativo : "")}
          >
            Encomendas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="orcamentos"
            className={({ isActive }) => (isActive ? styles.ativo : "")}
          >
            Orçamentos
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
