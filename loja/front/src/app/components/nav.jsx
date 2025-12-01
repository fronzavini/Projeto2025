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
import { getCartByUser } from "../lib/cartApi";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

// Converte tanto tupla (SELECT * sem DictCursor) quanto objeto (DictCursor)
function mapProduto(row) {
  if (Array.isArray(row)) {
    // id, nome, categoria, marca, preco, quantidade_estoque, estoque_minimo, estado, fornecedor_id, imagem_1, imagem_2, imagem_3
    return {
      id: row[0],
      nome: row[1],
      categoria: row[2],
      marca: row[3],
      preco: Number(row[4] || 0),
      imagem_1: row[9] || null,
    };
  }
  return {
    id: row.id,
    nome: row.nome,
    categoria: row.categoria,
    marca: row.marca,
    preco: Number(row.preco || 0),
    imagem_1: row.imagem_1 || null,
  };
}

async function fetchProdutos() {
  const res = await fetch(`${BASE}/listar_produtos`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  const listaBruta = Array.isArray(data) ? data : data?.detalhes || [];
  return listaBruta.map(mapProduto);
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [abrirBusca, setAbrirBusca] = useState(false);

  const [abrirLogin, setAbrirLogin] = useState(false);
  const [abrirRegister, setAbrirRegister] = useState(false);

  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [abrirUsuarioMenu, setAbrirUsuarioMenu] = useState(false);

  const [totalItens, setTotalItens] = useState(0);

  // Busca
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  // Scroll
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

  // Contador do carrinho
  useEffect(() => {
    (async () => {
      try {
        const userData = localStorage.getItem("usuario_loja");
        const idUsuario =
          (userData && JSON.parse(userData)?.id) ||
          Number(localStorage.getItem("idUsuario")) ||
          null;

        if (!idUsuario) return setTotalItens(0);

        const carrinho = await getCartByUser(idUsuario);
        const total =
          (carrinho?.produtos || []).reduce(
            (acc, p) => acc + Number(p.quantidade || 0),
            0
          ) || 0;
        setTotalItens(total);
      } catch {
        setTotalItens(0);
      }
    })();
  }, [logado]);

  // Clique no usuário
  const handleUsuarioClick = () => {
    if (logado) setAbrirUsuarioMenu(!abrirUsuarioMenu);
    else setAbrirLogin(true);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token_loja");
    localStorage.removeItem("usuario_loja");
    localStorage.removeItem("cart:" + (usuario?.id ?? ""));
    setLogado(false);
    setUsuario(null);
    setAbrirUsuarioMenu(false);
    setTotalItens(0);
    router.push("/");
  };

  const irParaPerfil = () => {
    setAbrirUsuarioMenu(false);
    router.push("/perfil");
  };

  // ===== BUSCA =====
  let buscaTimer;
  function handleChangeBusca(e) {
    const q = e.target.value;
    setQuery(q);

    if (buscaTimer) clearTimeout(buscaTimer);
    if (q.trim().length < 2) {
      setResultados([]);
      return;
    }

    buscaTimer = setTimeout(async () => {
      try {
        setCarregandoBusca(true);
        const produtos = await fetchProdutos();
        const f = produtos.filter((p) => {
          const alvo = `${p.nome} ${p.categoria || ""} ${
            p.marca || ""
          }`.toLowerCase();
          return alvo.includes(q.toLowerCase());
        });
        setResultados(f.slice(0, 8));
      } catch (err) {
        console.error("Erro na busca:", err);
        setResultados([]);
      } finally {
        setCarregandoBusca(false);
      }
    }, 180);
  }

  function handleSelectProduto(id) {
    setAbrirBusca(false);
    setQuery("");
    setResultados([]);
    router.push(`/produtoDetalhe/${id}`);
  }

  useEffect(() => {
    if (!abrirBusca) {
      setQuery("");
      setResultados([]);
    }
  }, [abrirBusca]);

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

          <li onClick={handleUsuarioClick} className={styles.iconClick}>
            <FontAwesomeIcon icon={faUser} />
          </li>

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
                placeholder="Buscar produtos..."
                value={query}
                onChange={handleChangeBusca}
                className={styles.searchInput}
                ref={(el) => setAnchorEl(el)}
              />
              <button
                className={styles.closeSearch}
                onClick={() => setAbrirBusca(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Dropdown alinhado ao input */}
            {query && (
              <div
                className={styles.resultadosContainer}
                style={
                  anchorEl
                    ? {
                        width: anchorEl.offsetWidth,
                        left:
                          anchorEl.getBoundingClientRect().left +
                          window.scrollX,
                        top:
                          anchorEl.getBoundingClientRect().bottom +
                          window.scrollY +
                          8,
                      }
                    : undefined
                }
              >
                {carregandoBusca ? (
                  <p className={styles.loading}>Carregando...</p>
                ) : resultados.length > 0 ? (
                  resultados.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={styles.resultadoItem}
                      onClick={() => handleSelectProduto(p.id)}
                    >
                      <img
                        src={
                          p.imagem_1
                            ? p.imagem_1.startsWith("http")
                              ? p.imagem_1
                              : `${BASE}/static/${p.imagem_1}`
                            : "/sem-imagem.png"
                        }
                        alt={p.nome}
                        className={styles.resultadoImg}
                      />
                      <div className={styles.resultadoInfo}>
                        <span className={styles.resultadoNome}>{p.nome}</span>
                        <span className={styles.resultadoPreco}>
                          R$ {p.preco.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className={styles.semResultados}>
                    Nenhum produto encontrado
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Menu do usuário */}
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
