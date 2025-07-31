import { NavLink } from "react-router-dom";
import styles from "../styles/MenuVendas.module.css";

export default function MenuDescontos() {
  return (
    <div className={styles.menuvendas}>
      <ul className={styles.menuLista}>
        <li>
          <NavLink
            to="cupom"
            className={({ isActive }) => (isActive ? styles.ativo : "")}
          >
            Cupom
          </NavLink>
        </li>
        <li>
          <NavLink
            to="frete"
            className={({ isActive }) => (isActive ? styles.ativo : "")}
          >
            Frete
          </NavLink>
        </li>
        <li>
          <NavLink
            to="desconto"
            className={({ isActive }) => (isActive ? styles.ativo : "")}
          >
            Descontos
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
