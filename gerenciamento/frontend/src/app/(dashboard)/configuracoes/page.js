"use client";
import { useState } from "react";
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

  const perfis = [
    { nome: "Administrador", permissoes: "Acesso total" },
    { nome: "Vendedor", permissoes: "Vendas, estoque" },
    { nome: "Financeiro", permissoes: "Financeiro, relatórios" },
  ];

  const salvarConfiguracoes = () => {
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Configurações do Sistema</h2>

      <IdiomaCard idioma={idioma} setIdioma={setIdioma} />
      <VersaoCard />
      <PerfisCard perfis={perfis} />
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
        <button className={styles.botao}>Restaurar Padrões</button>
      </div>
    </div>
  );
}
