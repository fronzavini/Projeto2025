"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import PerfilForm from "../components/perfilForm";
import PedidosList from "../components/pedidosList";
import EnderecoForm from "../components/EnderecoForm";

import {
  FaFileInvoice,
  FaUser,
  FaHome,
  FaSignOutAlt,
  FaTruck,
} from "react-icons/fa";

import styles from "../styles/perfil.module.css";

export default function PerfilPage() {
  const router = useRouter();

  const [aba, setAba] = useState("pedidos");
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Busca usuário logado no localStorage
    const usuarioLogado = localStorage.getItem("usuario_loja");

    if (!usuarioLogado) {
      router.push("/login"); // se não estiver logado, manda pro login
      return;
    }

    const dados = JSON.parse(usuarioLogado);
    setUsuario(dados);

    // Aqui você vai substituir por sua API real
    const pedidosMock = [
      { id: 1, data: "2025-11-28", status: "Entregue", valor: 120.5 },
      { id: 2, data: "2025-11-29", status: "Em transporte", valor: 80.0 },
    ];

    setPedidos(pedidosMock);
  }, []);

  // Botão de sair
  function deslogar() {
    localStorage.removeItem("usuario_loja");
    localStorage.removeItem("token_loja");
    router.push("/");
  }

  if (!usuario) return null; // evita piscar antes de carregar

  return (
    <div className={styles.perfilWrapper}>
      {/* BREADCRUMB */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}>&gt;</span>
        <span className={styles.breadcrumbCurrent}>Pedidos</span>
      </div>

      <div className={styles.container}>
        {/* MENU LATERAL */}
        <aside className={styles.sidebar}>
          <ul>
            <li
              className={aba === "pedidos" ? styles.active : ""}
              onClick={() => setAba("pedidos")}
            >
              <FaTruck className={styles.icon} /> Pedidos
            </li>

            <hr className={styles.menuSeparator} />

            <li
              className={aba === "dados" ? styles.active : ""}
              onClick={() => setAba("dados")}
            >
              <FaUser className={styles.icon} /> Seus dados
            </li>

            <li
              className={aba === "endereco" ? styles.active : ""}
              onClick={() => setAba("endereco")}
            >
              <FaHome className={styles.icon} /> Endereços
            </li>

            <hr className={styles.menuSeparator} />

            <li className={styles.sair}>
              <button className={styles.sairBtn} onClick={deslogar}>
                <FaSignOutAlt className={styles.icon} />
                Sair
              </button>
            </li>
          </ul>
        </aside>

        {/* CONTEÚDO */}
        <main className={styles.main}>
          {aba === "dados" && <PerfilForm usuario={usuario} />}
          {aba === "pedidos" && <PedidosList pedidos={pedidos} />}
          {aba === "endereco" && <EnderecoForm usuario={usuario} />}
        </main>
      </div>
    </div>
  );
}
