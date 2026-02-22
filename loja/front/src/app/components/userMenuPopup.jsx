// components/UserMenuPopup.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/userMenu.module.css";

export default function UserMenuPopup({ usuario, deslogar }) {
  const router = useRouter();

  return (
    <div className={styles.menuPopup}>
      <button
        className={styles.menuItem}
        onClick={() => router.push("/perfil")}
      >
        Meu Perfil
      </button>
      <button
        className={styles.menuItem}
        onClick={() => {
          deslogar(); // função passada do Nav ou Context
          router.push("/"); // redireciona para home após logout
        }}
      >
        Sair
      </button>
    </div>
  );
}
