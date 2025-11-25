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

import LoginPopup from "./loginPopup";
import RegisterPopup from "./registerPopup";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [abrirBusca, setAbrirBusca] = useState(false);

  // ESTADOS DOS POPUPS
  const [abrirLogin, setAbrirLogin] = useState(false);
  const [abrirRegister, setAbrirRegister] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        {/* ÍCONE MENU MOBILE */}
        <div
          className={styles.menuIcon}
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <FontAwesomeIcon icon={menuAberto ? faTimes : faBars} />
        </div>

        {/* --- MENU DESKTOP --- */}
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

        {/* ÍCONES DIREITA */}
        <ul className={styles.user}>
          <li
            onClick={() => setAbrirBusca(!abrirBusca)}
            className={styles.iconClick}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </li>

          {/* ABRE LOGIN */}
          <li onClick={() => setAbrirLogin(true)} className={styles.iconClick}>
            <FontAwesomeIcon icon={faUser} />
          </li>

          <li>
            <FontAwesomeIcon icon={faCartShopping} />
          </li>
        </ul>

        {/* BARRA DE BUSCA */}
        {abrirBusca && (
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={styles.searchIcon}
              />

              <input
                type="text"
                placeholder="Estou buscando por..."
                className={styles.searchInput}
              />

              <button
                className={styles.closeSearch}
                onClick={() => setAbrirBusca(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        )}

        {/* MENU MOBILE */}
        {menuAberto && (
          <div className={styles.menuMobile}>
            <ul>
              <li>
                <Link href="/" onClick={() => setMenuAberto(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sobre" onClick={() => setMenuAberto(false)}>
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/flores" onClick={() => setMenuAberto(false)}>
                  Flores
                </Link>
              </li>
              <li>
                <Link href="/arranjos" onClick={() => setMenuAberto(false)}>
                  Arranjos
                </Link>
              </li>
              <li>
                <Link href="/orcamentos" onClick={() => setMenuAberto(false)}>
                  Orçamentos
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* POPUP LOGIN */}
      {abrirLogin && (
        <LoginPopup
          fechar={() => setAbrirLogin(false)}
          irParaRegister={() => {
            setAbrirLogin(false);
            setAbrirRegister(true);
          }}
        />
      )}

      {/* POPUP REGISTRO */}
      {abrirRegister && (
        <RegisterPopup
          fechar={() => setAbrirRegister(false)}
          irParaLogin={() => {
            setAbrirRegister(false);
            setAbrirLogin(true);
          }}
        />
      )}
    </>
  );
}
