"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "../styles/nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      {/* Ícone do menu (hambúrguer) - só aparece no mobile */}
      <div
        className={styles.menuIcon}
        onClick={() => setMenuAberto(!menuAberto)}
      >
        <FontAwesomeIcon icon={menuAberto ? faTimes : faBars} />
      </div>

      {/* MENU DESKTOP */}
      <ul className={styles.menu}>
        <li>
          <Link href="/" className={pathname === "/" ? styles.active : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/sobre"
            className={pathname === "/sobre" ? styles.active : ""}
          >
            Sobre
          </Link>
        </li>
        <li>
          <Link
            href="/flores"
            className={pathname === "/flores" ? styles.active : ""}
          >
            Flores
          </Link>
        </li>
        <li>
          <Link
            href="/arranjos"
            className={pathname === "/arranjos" ? styles.active : ""}
          >
            Arranjos
          </Link>
        </li>
        <li>
          <Link
            href="/orcamentos"
            className={pathname === "/orcamentos" ? styles.active : ""}
          >
            Orçamentos
          </Link>
        </li>
      </ul>

      {/* ÍCONES DE USUÁRIO */}
      <ul className={styles.user}>
        <li>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </li>
        <li>
          <FontAwesomeIcon icon={faUser} />
        </li>
        <li>
          <FontAwesomeIcon icon={faCartShopping} />
        </li>
      </ul>

      {/* MENU MOBILE (abre com o hambúrguer) */}
      {menuAberto && (
        <div className={styles.menuMobile}>
          <ul>
            <li>
              <Link
                href="/"
                onClick={() => setMenuAberto(false)}
                className={pathname === "/" ? styles.active : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/sobre"
                onClick={() => setMenuAberto(false)}
                className={pathname === "/sobre" ? styles.active : ""}
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                href="/flores"
                onClick={() => setMenuAberto(false)}
                className={pathname === "/flores" ? styles.active : ""}
              >
                Flores
              </Link>
            </li>
            <li>
              <Link
                href="/arranjos"
                onClick={() => setMenuAberto(false)}
                className={pathname === "/arranjos" ? styles.active : ""}
              >
                Arranjos
              </Link>
            </li>
            <li>
              <Link
                href="/orcamentos"
                onClick={() => setMenuAberto(false)}
                className={pathname === "/orcamentos" ? styles.active : ""}
              >
                Orçamentos
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
