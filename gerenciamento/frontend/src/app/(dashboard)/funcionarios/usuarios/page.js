"use client";

import { useState } from "react";
import CadastrarUsuario from "@/app/components/funcionarios/cadastrarUsuario";
import TabelaUsuarios from "@/app/components/funcionarios/tabelaUsuario";
import styles from "../../../styles/cadastrarUsuario.module.css";

export default function FuncionariosPage() {
  // Atualiza a tabela ao cadastrar novo usuário
  const [refresh, setRefresh] = useState(false);

  const handleUsuarioCadastrado = () => {
    setRefresh(!refresh); // alterna o estado para recarregar a tabela
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Gerenciar Usuários do Sistema</h1>

      <div className={styles.pageSections}>
        <section className={styles.cadastrarSection}>
          <h2>Cadastrar Novo Usuário</h2>
          <CadastrarUsuario onUsuarioCadastrado={handleUsuarioCadastrado} />
        </section>

        <section className={styles.tabelaSection}>
          <h2>Usuários Cadastrados</h2>
          <TabelaUsuarios key={refresh} />
        </section>
      </div>
    </div>
  );
}
