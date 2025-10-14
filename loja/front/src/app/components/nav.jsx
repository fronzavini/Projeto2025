"use client";
import styles from "../styles/nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

export default function Nav() {
  <nav className={styles.nav}>
    <ul className={styles.menu}>
      <li className={styles.item}>Home</li>
      <li className={styles.item}>Sobre</li>
      <li className={styles.item}>Flores</li>
      <li className={styles.item}>Arranjos</li>
      <li className={styles.item}>Orçamentos</li>
    </ul>
    <ul className={styles.user}>
      <li className={styles.item}><FontAwesomeIcon icon={faMagnifyingGlass} />  </li>
      <li className={styles.item}><FontAwesomeIcon icon={faUser} />  </li>
      <li className={styles.item}><FontAwesomeIcon icon={faCartShopping} />  </li>
      
      
    </ul>
  </nav>;
}
