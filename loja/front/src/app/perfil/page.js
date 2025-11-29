"use client";
import { useState, useEffect } from "react";
// Importar Link do Next.js para navegação
import Link from "next/link";
import { useRouter } from "next/navigation";

import PerfilForm from "../components/perfilForm";
import PedidosList from "../components/pedidosList";
import EnderecoForm from "../components/EnderecoForm";

// Ícones Font Awesome (assumindo que você voltou para eles ou terá um setup híbrido)
import {
  FaFileInvoice,
  FaUser,
  FaHome,
  FaSignOutAlt,
  FaTruck, // Ícone de caminhão para Pedidos
} from "react-icons/fa";

import styles from "../styles/perfil.module.css";

export default function PerfilPage() {
  const router = useRouter();
  // Começamos na aba "pedidos" para condizer com o breadcrumb
  const [aba, setAba] = useState("pedidos");
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // ... (mock data remain the same)
    const usuarioMock = {
      nome: "Maria Silva",
      email: "maria@email.com",
      telefone: "11999999999",
      endereco: {
        cep: "00000-000",
        rua: "Rua Exemplo",
        numero: "123",
        cidade: "São Paulo",
        estado: "SP",
      },
    };

    const pedidosMock = [
      { id: 1, data: "2025-11-28", status: "Entregue", valor: 120.5 },
      { id: 2, data: "2025-11-29", status: "Em transporte", valor: 80.0 },
    ];

    setUsuario(usuarioMock);
    setPedidos(pedidosMock);
  }, []);

  return (
    <div className={styles.perfilWrapper}>
      {" "}
      {/* Novo Wrapper para o Breadcrumb */}
      {/* BREADCRUMB: Home > Pedidos */}
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
              <button
                className={styles.sairBtn}
                onClick={() => console.log("logout")}
              >
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
