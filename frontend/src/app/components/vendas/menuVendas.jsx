"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../styles/menuVendas.module.css";

export default function MenuVendas() {
  const pathname = usePathname();

  const itens = [
    { href: "/vendas/balcao", label: "Balcão" },
    { href: "/vendas/encomendas", label: "Encomendas" },
    { href: "/vendas/orcamentos", label: "Orçamentos" },
  ];

  return (
    <div className={styles.menuvendas}>
      <ul className={styles.menuLista}>
        {itens.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={pathname.startsWith(item.href) ? styles.ativo : ""}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
