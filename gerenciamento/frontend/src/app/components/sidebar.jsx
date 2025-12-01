"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../styles/sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCashRegister,
  faBoxOpen,
  faWarehouse,
  faMoneyCheckDollar,
  faTag,
  faUsers,
  faUserTie,
  faTruck,
  faGear,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ALL_ITEMS = [
  { href: "/", icon: faHome, label: "Home" },
  { href: "/vendas", icon: faCashRegister, label: "Vendas" },
  { href: "/produtos", icon: faBoxOpen, label: "Produtos" },
  { href: "/estoque", icon: faWarehouse, label: "Estoque" },
  { href: "/financeiro", icon: faMoneyCheckDollar, label: "Financeiro" },
  { href: "/descontos", icon: faTag, label: "Descontos" },
  { href: "/clientes", icon: faUsers, label: "Clientes" },
  { href: "/funcionarios", icon: faUserTie, label: "Funcionários" },
  { href: "/fornecedores", icon: faTruck, label: "Fornecedores" },
  { href: "/configuracoes", icon: faGear, label: "Configurações" },
];

function normalizeRole(v) {
  const s = (v || "").toString().trim().toLowerCase();
  if (s === "administrador") return "Administrador";
  if (s === "vendedor") return "Vendedor";
  if (s === "estoque" || s === "estoquista") return "Estoque";
  return "Vendedor";
}

function getRoleFromStorage() {
  try {
    const raw = localStorage.getItem("usuario_sistema");
    if (!raw) return "Vendedor";
    const parsed = JSON.parse(raw);
    return normalizeRole(parsed?.tipo_usuario);
  } catch {
    return "Vendedor";
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  // ⚠️ Flag para garantir que o primeiro render do cliente
  // seja igual ao do servidor (sem dados dinâmicos).
  const [mounted, setMounted] = useState(false);

  // Armazena a role após montar
  const [tipoUsuario, setTipoUsuario] = useState("Vendedor");

  useEffect(() => {
    setMounted(true);
    // aplica role do storage
    setTipoUsuario(getRoleFromStorage());

    // Atualiza se outra aba alterar o storage (ou se você trocar via app)
    const onStorage = (e) => {
      if (e.key === "usuario_sistema") setTipoUsuario(getRoleFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Mapa de permissões
  const allowedRoutes = useMemo(() => {
    const MAP = {
      Administrador: ALL_ITEMS.map((i) => i.href),
      Vendedor: ["/vendas", "/configuracoes"],
      Estoque: ["/produtos", "/estoque", "/configuracoes"],
    };
    const base = MAP[tipoUsuario] || MAP.Vendedor;
    // Home sempre permitida
    return Array.from(new Set(["/", ...base]));
  }, [tipoUsuario]);

  // Filtra itens só DEPOIS de montar (evita mismatch)
  const menuItems = useMemo(() => {
    if (!mounted) return []; // no SSR e no 1º render do cliente, lista vazia idêntica
    return ALL_ITEMS.filter((item) =>
      allowedRoutes.some(
        (p) => item.href === p || (p !== "/" && item.href.startsWith(p))
      )
    );
  }, [mounted, allowedRoutes]);

  // Redireciona se a rota atual não for permitida (após montar)
  useEffect(() => {
    if (!mounted) return;
    const canAccess = allowedRoutes.some(
      (p) => pathname === p || (p !== "/" && pathname.startsWith(p))
    );
    if (!canAccess) {
      // envia para a primeira rota permitida (fora "/"), senão "/"
      const fallback = menuItems.find((i) => i.href !== "/")?.href || "/";
      if (fallback && fallback !== pathname) router.replace(fallback);
    }
  }, [mounted, pathname, allowedRoutes, menuItems, router]);

  return (
    <>
      <button className={styles.hamburguer} onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <nav>
          <ul>
            {/* Enquanto não montou, renderiza um esqueleto estável (sem links dinâmicos) */}
            {!mounted
              ? ALL_ITEMS.slice(0, 1).map((item) => (
                  <li key={item.href}>
                    <span className={styles.link}>
                      <FontAwesomeIcon icon={faHome} /> Carregando…
                    </span>
                  </li>
                ))
              : menuItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`${styles.link} ${
                          active ? styles.active : ""
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={item.icon} /> {item.label}
                      </Link>
                    </li>
                  );
                })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
