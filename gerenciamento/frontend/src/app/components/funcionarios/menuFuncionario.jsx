"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../styles/menuVendas.module.css";

export default function MenuFuncionario() {
  const pathname = usePathname();

  const itens = [
    { href: "/funcionarios/funcionario", label: "Funcionários" },
    { href: "/funcionarios/usuarios", label: "Usuários" },
  ];

  return (
    <div className={styles.menuvendas}>
      <ul className={styles.menuLista}>
        {itens.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={pathname.startsWith(item.href) ? styles.ativo : ""}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}