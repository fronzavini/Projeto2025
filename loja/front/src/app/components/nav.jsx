"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
// ⬇️ removido useCarrinho
// import { useCarrinho } from "../context/carrinhoContext";
import { getCartByUser } from "../lib/cartApi"; // ⬅️ usa o helper das rotas

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [abrirBusca, setAbrirBusca] = useState(false);

  const [abrirLogin, setAbrirLogin] = useState(false);
  const [abrirRegister, setAbrirRegister] = useState(false);

  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [abrirUsuarioMenu, setAbrirUsuarioMenu] = useState(false);

  const [totalItens, setTotalItens] = useState(0); // ⬅️ contador do carrinho

  const router = useRouter();
  const pathname = usePathname();

  // Detecta scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Verifica login ao montar
  useEffect(() => {
    const token = localStorage.getItem("token_loja");
    const userData = localStorage.getItem("usuario_loja");

    if (token && userData) {
      setLogado(true);
      try {
        setUsuario(JSON.parse(userData));
      } catch {
        setUsuario(null);
      }
    } else {
      setLogado(false);
      setUsuario(null);
    }
  }, []);

  // Busca quantidade de itens no carrinho (backend)
  useEffect(() => {
    async function carregarContador() {
      try {
        const userData = localStorage.getItem("usuario_loja");
        const idUsuario =
          (userData && JSON.parse(userData)?.id) ||
          Number(localStorage.getItem("idUsuario")) ||
          null;

        if (!idUsuario) {
          setTotalItens(0);
          return;
        }

        const carrinho = await getCartByUser(idUsuario);
        const total =
          (carrinho?.produtos || []).reduce(
            (acc, p) => acc + Number(p.quantidade || 0),
            0
          ) || 0;
        setTotalItens(total);
      } catch (e) {
        console.error("Erro ao carregar contador do carrinho:", e);
        setTotalItens(0);
      }
    }

    carregarContador();
  }, [logado]);

  // Clique no ícone do usuário
  const handleUsuarioClick = () => {
    if (logado) {
      setAbrirUsuarioMenu(!abrirUsuarioMenu);
    } else {
      setAbrirLogin(true);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token_loja");
    localStorage.removeItem("usuario_loja");
    localStorage.removeItem("cart:" + (usuario?.id ?? "")); // limpa cache do carrinho deste usuário (se existir)
    setLogado(false);
    setUsuario(null);
    setAbrirUsuarioMenu(false);
    setTotalItens(0);
    router.refresh();
    router.push("/");
  };

  // Ir para perfil
  const irParaPerfil = () => {
    setAbrirUsuarioMenu(false);
    router.push("/perfil");
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div
          className={styles.menuIcon}
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <FontAwesomeIcon icon={menuAberto ? faTimes : faBars} />
        </div>

        {/* Menu desktop */}
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
        </ul>

        {/* Ícones direita */}
        <ul className={styles.user}>
          <li
            onClick={() => setAbrirBusca(!abrirBusca)}
            className={styles.iconClick}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </li>

          {/* Ícone do usuário */}
          <li onClick={handleUsuarioClick} className={styles.iconClick}>
            <FontAwesomeIcon icon={faUser} />
          </li>

          {/* Ícone carrinho com contador */}
          <li className={styles.cartIcon}>
            <Link href="/carrinho">
              <FontAwesomeIcon icon={faCartShopping} />
              {totalItens > 0 && (
                <span className={styles.cartBadge}>{totalItens}</span>
              )}
            </Link>
          </li>
        </ul>

        {/* Barra de busca */}
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

        {/* Menu do usuário (popup) */}
        {abrirUsuarioMenu && logado && (
          <div className={styles.usuarioMenu}>
            <p className={styles.usuarioNome}>
              Olá, <b>{usuario?.nome}</b>
            </p>
            <button onClick={irParaPerfil}>Meu Perfil</button>
            <button onClick={handleLogout}>Sair</button>
          </div>
        )}

        {/* Menu mobile */}
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

              {logado && (
                <li>
                  <button
                    onClick={handleLogout}
                    className={styles.mobileLogoutBtn}
                  >
                    Sair
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Pop-ups login/register */}
      {abrirLogin && (
        <LoginPopup
          fechar={() => setAbrirLogin(false)}
          irParaRegister={() => {
            setAbrirLogin(false);
            setAbrirRegister(true);
          }}
        />
      )}
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
