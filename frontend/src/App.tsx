import Header from './components/header';
import Sidebar from './components/sidebar';
import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Vendas from './pages/Vendas';
import Produtos from './pages/Produtos';
import Estoque from './pages/Estoque';
import Financeiro from './pages/Financeiro';
import Descontos from './pages/Descontos';
import Clientes from './pages/Clientes';
import Funcionarios from './pages/Funcionarios';
import Fornecedores from './pages/Fornecedores';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes'; 

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.conteudo}>
        
        <Sidebar />
        <div className={styles.mainContent}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendas" element={<Vendas />} />
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
