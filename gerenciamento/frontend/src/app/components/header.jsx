"use client";

import styles from "../styles/header.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Header() {
  const [modal, setModal] = useState(false);
  const router = useRouter();

  const [nomeFuncionario, setNomeFuncionario] = useState("Carregando...");

  const abrirModal = () => {
    setModal(!modal);
  };

  const sair = () => {
    router.push("/login");
  };

  useEffect(() => {
    // 1️⃣ Buscar o usuário salvo no login
    const userLS = localStorage.getItem("usuario_sistema");
    const funcionarioLS = localStorage.getItem("funcionario");

    if (!userLS || !funcionarioLS) {
      setNomeFuncionario("Usuário");
      return;
    }

        // Carrega o tema salvo no localStorage
    const tema = localStorage.getItem("tema") || "claro";

    // Aplica o tema
    document.body.setAttribute("data-theme", tema === "escuro" ? "dark" : "light");

    const funcionario = JSON.parse(funcionarioLS);

    // 2️⃣ Exibir nome do funcionário
    if (funcionario?.nome) {
      setNomeFuncionario(funcionario.nome);
    } else {
      setNomeFuncionario("Usuário");
    }
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <h1 className={styles.logo}>BellaDonna</h1>
      </div>

      <div className={styles.avatar}>
        <button onClick={abrirModal} className={styles.botao_modal}>
          <img
            src="https://media.istockphoto.com/id/1386479313/pt/foto/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=rzUSobX0RTFPksl6-Pl28C5itfvrW3mug6NkFW7kPeQ="
            alt="Foto de perfil"
            className={styles.avatar}
          />
        </button>
      </div>

      {modal && (
        <div className={styles.modal}>
          <div className={styles.modal_conteudo}>
            <div className={styles.modal_header}>
              <h3>{nomeFuncionario}</h3>

              <button onClick={abrirModal} className={styles.botao_fechar}>
                X
              </button>
            </div>

            <Link href="/configuracoes">
              <span className={styles.link}>Perfil</span>
            </Link>

            <button onClick={sair} className={styles.botao_simples}>
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
