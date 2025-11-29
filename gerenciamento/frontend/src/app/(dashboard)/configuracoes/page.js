"use client";
import { useEffect, useState } from "react";
import styles from "../../styles/configuracoes.module.css";

import IdiomaCard from "@/app/components/configuracoes/idiomaCard";
import VersaoCard from "@/app/components/configuracoes/versaoCard";
import PerfisCard from "@/app/components/configuracoes/perfisCard";
import InicializacaoCard from "@/app/components/configuracoes/inicializacaoCard";
import InterfaceCard from "@/app/components/configuracoes/interfaceCard";
import SegurancaCard from "@/app/components/configuracoes/segurancaCard";

export default function Configuracoes() {
  const [idioma, setIdioma] = useState("pt-BR");
  const [tema, setTema] = useState("claro");
  const [abrirComSistema, setAbrirComSistema] = useState(true);
  const [restaurarSessao, setRestaurarSessao] = useState(true);
  const [senhaInatividade, setSenhaInatividade] = useState(true);
  const [autenticacao2FA, setAutenticacao2FA] = useState(false);

  const [usuario, setUsuario] = useState(null);

  // Carrega dados salvos
  useEffect(() => {
    const userLS = JSON.parse(localStorage.getItem("usuario_sistema"));
    const temaLS = localStorage.getItem("tema") || "claro";

    setUsuario(userLS);
    setTema(temaLS);

    document.body.setAttribute("data-theme", temaLS === "escuro" ? "dark" : "light");
  }, []);

  const salvarConfiguracoes = async () => {
    // 1. Aplica tema visual
    document.body.setAttribute("data-theme", tema === "escuro" ? "dark" : "light");

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
        await fetch(`http://127.0.0.1:5000/editar_usuario_sistema/${usuario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tema_preferido: tema,
            usuario: usuario.usuario,
            senha: usuario.senha,
            tipo_usuario: usuario.tipo_usuario,
            funcionario_id: usuario.funcionario_id
          }),
        });
      } catch (err) {
        console.error("Erro ao salvar tema no servidor:", err);
      }
    }

    alert("Configurações salvas com sucesso!");
  };

  const restaurarPadroes = () => {
    setIdioma("pt-BR");
    setTema("claro");
    setAbrirComSistema(true);
    setRestaurarSessao(true);
    setSenhaInatividade(true);
    setAutenticacao2FA(false);

    // NÃO salva nada — apenas reseta o estado
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Configurações do Sistema</h2>

      <IdiomaCard idioma={idioma} setIdioma={setIdioma} />
      <VersaoCard />
      <PerfisCard perfis={[
        { nome: "Administrador", permissoes: "Acesso total" },
        { nome: "Vendedor", permissoes: "Vendas, estoque" },
        { nome: "Financeiro", permissoes: "Financeiro, relatórios" },
      ]} />

      <InicializacaoCard
        abrirComSistema={abrirComSistema}
        setAbrirComSistema={setAbrirComSistema}
        restaurarSessao={restaurarSessao}
        setRestaurarSessao={setRestaurarSessao}
      />

      <InterfaceCard tema={tema} setTema={setTema} />

      <SegurancaCard
        senhaInatividade={senhaInatividade}
        setSenhaInatividade={setSenhaInatividade}
        autenticacao2FA={autenticacao2FA}
        setAutenticacao2FA={setAutenticacao2FA}
      />

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
