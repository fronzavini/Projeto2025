// app/perfil/page.jsx
"use client";
import { useState, useEffect } from "react";
import PerfilForm from "../../components/PerfilForm";
import PedidosList from "../../components/PedidosList";
import styles from "../../styles/perfil.module.css";

export default function PerfilPage() {
  const [abaAtiva, setAbaAtiva] = useState("dados"); // 'dados' ou 'pedidos'
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Simulação de fetch dos dados do usuário e pedidos
    const usuarioMock = {
      nome: "Maria Silva",
      email: "maria@email.com",
      telefone: "11999999999",
      endereco: "Rua Exemplo, 123",
    };
    const pedidosMock = [
      { id: 1, data: "2025-11-28", status: "Entregue", valor: 120.5 },
      { id: 2, data: "2025-11-29", status: "Em transporte", valor: 80.0 },
    ];

    setUsuario(usuarioMock);
    setPedidos(pedidosMock);
  }, []);

  return (
    <div className={styles.perfilContainer}>
      <h1>Meu Perfil</h1>

      {/* --- Abas --- */}
      <div className={styles.abas}>
        <button
          className={abaAtiva === "dados" ? styles.ativa : ""}
          onClick={() => setAbaAtiva("dados")}
        >
          Meus Dados
        </button>
        <button
          className={abaAtiva === "pedidos" ? styles.ativa : ""}
          onClick={() => setAbaAtiva("pedidos")}
        >
          Meus Pedidos
        </button>
      </div>

      {/* --- Conteúdo da aba --- */}
      <div className={styles.conteudoAba}>
        {abaAtiva === "dados" && <PerfilForm usuario={usuario} />}
        {abaAtiva === "pedidos" && <PedidosList pedidos={pedidos} />}
      </div>
    </div>
  );
}
