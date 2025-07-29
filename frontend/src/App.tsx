import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import styles from "./App.module.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Vendas from "./pages/Vendas";
import Balcao from "./pages/Balcao";
import Encomendas from "./pages/Encomendas";
import Orcamentos from "./pages/Orcamentos";

import Produtos from "./pages/Produtos";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/Financeiro";
import Descontos from "./pages/Descontos";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Fornecedores from "./pages/Fornecedores";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.conteudo}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Rota Vendas com rotas filhas */}
            <Route path="/vendas" element={<Vendas />}>
              {/* Redireciona /vendas para /vendas/balcao */}
              <Route index element={<Navigate to="balcao" replace />} />
              <Route path="balcao" element={<Balcao />} />
              <Route path="encomendas" element={<Encomendas />} />
              <Route path="orcamentos" element={<Orcamentos />} />
            </Route>

            <Route path="/produtos" element={<Produtos />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/descontos" element={<Descontos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
