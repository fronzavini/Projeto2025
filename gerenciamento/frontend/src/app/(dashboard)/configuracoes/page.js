// app/configuracoes/page.jsx (ou onde estiver seu componente)
"use client";
import { useEffect, useState } from "react";
import styles from "../../styles/configuracoes.module.css";

import VersaoCard from "@/app/components/configuracoes/versaoCard";
import InterfaceCard from "@/app/components/configuracoes/interfaceCard";
import EditarUsuario from "@/app/components/configuracoes/editarUsuario";

export default function Configuracoes() {
  const [tema, setTema] = useState("claro");
  const [temaInicial, setTemaInicial] = useState("claro");
  const [usuario, setUsuario] = useState(null);

  // Carrega dados salvos
  useEffect(() => {
    const userLS = JSON.parse(localStorage.getItem("usuario_sistema"));
    const temaLS = localStorage.getItem("tema") || "claro";

    setUsuario(userLS);
    setTema(temaLS);
    setTemaInicial(temaLS);

    // aplica o tema salvo ao entrar
    document.body.setAttribute(
      "data-theme",
      temaLS === "escuro" ? "dark" : "light"
    );
  }, []);

  // PREVIEW ao vivo: aplica o tema conforme o estado muda (sem salvar)
  useEffect(() => {
    document.body.setAttribute(
      "data-theme",
      tema === "escuro" ? "dark" : "light"
    );
  }, [tema]);

  // Ao sair da página sem salvar, restaura o tema original
  useEffect(() => {
    return () => {
      document.body.setAttribute(
        "data-theme",
        temaInicial === "escuro" ? "dark" : "light"
      );
    };
  }, [temaInicial]);

  const salvarConfiguracoes = async () => {
    // 1. (opcional – já está aplicado pelo preview)
    document.body.setAttribute(
      "data-theme",
      tema === "escuro" ? "dark" : "light"
    );

    // 2. Salva no localStorage
    localStorage.setItem("tema", tema);

    // 3. Atualiza usuário salvo no localStorage
    if (usuario) {
      const atualizado = { ...usuario, tema_preferido: tema };
      localStorage.setItem("usuario_sistema", JSON.stringify(atualizado));
      setUsuario(atualizado);
    }

    // 4. Atualiza no banco de dados
    if (usuario?.id) {
      try {
        await fetch(
          `http://127.0.0.1:5000/editar_usuario_sistema/${usuario.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tema_preferido: tema,
              usuario: usuario.usuario,
              senha: usuario.senha,
              tipo_usuario: usuario.tipo_usuario,
              funcionario_id: usuario.funcionario_id,
            }),
          }
        );
      } catch (err) {
        console.error("Erro ao salvar tema no servidor:", err);
      }
    }

    // Atualiza o "temaInicial" para que o unmount não reverta após salvar
    setTemaInicial(tema);

    alert("Configurações salvas com sucesso!");
  };

  const restaurarPadroes = () => {
    setTema("claro"); // preview já troca na hora
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Configurações do Sistema</h2>

      <VersaoCard />

      <InterfaceCard tema={tema} setTema={setTema} />

      {usuario && <EditarUsuario usuario={usuario} setUsuario={setUsuario} />}

      <div className={styles.botoes}>
        <button className={styles.botaoSalvar} onClick={salvarConfiguracoes}>
          Salvar Alterações
        </button>
        <button className={styles.botao} onClick={restaurarPadroes}>
          Restaurar Padrões
        </button>
      </div>
    </div>
  );
}
