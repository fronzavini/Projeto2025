"use client";

import styles from "../styles/header.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation"; // <- useRouter no App Router
import Link from "next/link";

function Header() {
  const [modal, setModal] = useState(false);
  const router = useRouter(); // <- inicializa o router

  const abrirModal = () => {
    setModal(!modal);
  };

  const sair = () => {
    // Aqui você pode limpar cookies, localStorage, ou token de autenticação se houver
    router.push("/login"); // <- redireciona para a página de login
  };

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
              <h3>Nome usuário</h3>
              <button onClick={abrirModal} className={styles.botao_fechar}>
                X
              </button>
            </div>

            <Link href="/configuracoes">
              <span className={styles.link}>Configurações</span>
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
