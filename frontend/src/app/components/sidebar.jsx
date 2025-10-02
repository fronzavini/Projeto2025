"use client";

import { useState } from "react";
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
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Botão hambúrguer */}
      <button className={styles.hamburguer} onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${
                    pathname === item.href ? styles.active : ""
                  }`}
                  onClick={() => setIsOpen(false)} // fecha ao clicar
                >
                  <FontAwesomeIcon icon={item.icon} /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;