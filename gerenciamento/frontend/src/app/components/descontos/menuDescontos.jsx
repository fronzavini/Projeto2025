"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../styles/menuVendas.module.css";

export default function MenuDescontos() {
  const pathname = usePathname();

  const itens = [
    { href: "/descontos/cupom", label: "Cupom" },
   // { href: "/descontos/frete", label: "Frete" },
    { href: "/descontos/desconto", label: "Descontos" },
  ];

  return (
    <nav className={styles.menuvendas}>
      <ul className={styles.menuLista}>
        {itens.map((item) => {
          const isAtivo = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} className={isAtivo ? styles.ativo : ""}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
