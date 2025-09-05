"use client";

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
  faChartLine,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname(); // pega a rota atual

  const menuItems = [
    { href: "/", icon: faHome, label: "Home" },
    { href: "/vendas", icon: faCashRegister, label: "Vendas" },
    { href: "/produtos", icon: faBoxOpen, label: "Produtos" },
    { href: "/estoque", icon: faWarehouse, label: "Estoque" },
    { href: "/financeiro", icon: faMoneyCheckDollar, label: "Financeiro" },
    { href: "/descontos", icon: faTag, label: "Descontos" },
    { href: "/clientes", icon: faUsers, label: "Clientes" },
    { href: "/funcionarios", icon: faUserTie, label: "Funcionários" },
    { href: "/fornecedores", icon: faTruck, label: "Fornecedores" },
    { href: "/relatorios", icon: faChartLine, label: "Relatórios" },
    { href: "/configuracoes", icon: faGear, label: "Configurações" },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${
                  pathname === item.href ? styles.active : ""
                }`}
              >
                <FontAwesomeIcon icon={item.icon} /> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
