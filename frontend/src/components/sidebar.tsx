import styles from '../styles/sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCashRegister,
  faBoxOpen,
  faWarehouse,
  faMoneyCheckDollar,
  faTag,
  faUsers,
  faUserTie,
  faTruck,
  faChartLine,
  faGear
} from '@fortawesome/free-solid-svg-icons';

import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import type { ReactNode } from 'react';

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <CustomLink to="/" className={styles.link}><FontAwesomeIcon icon={faHome} /> Home</CustomLink>
          <CustomLink to="/vendas" className={styles.link}><FontAwesomeIcon icon={faCashRegister} /> Vendas</CustomLink>
          <CustomLink to="/produtos" className={styles.link}><FontAwesomeIcon icon={faBoxOpen} /> Produtos</CustomLink>
          <CustomLink to="/estoque" className={styles.link}><FontAwesomeIcon icon={faWarehouse} /> Estoque</CustomLink>
          <CustomLink to="/financeiro" className={styles.link}><FontAwesomeIcon icon={faMoneyCheckDollar} /> Financeiro</CustomLink>
          <CustomLink to="/descontos" className={styles.link}><FontAwesomeIcon icon={faTag} /> Descontos</CustomLink>
          <CustomLink to="/clientes" className={styles.link}><FontAwesomeIcon icon={faUsers} /> Clientes</CustomLink>
          <CustomLink to="/funcionarios" className={styles.link}><FontAwesomeIcon icon={faUserTie} /> Funcionários</CustomLink>
          <CustomLink to="/fornecedores" className={styles.link}><FontAwesomeIcon icon={faTruck} /> Fornecedores</CustomLink>
          <CustomLink to="/relatorios" className={styles.link}><FontAwesomeIcon icon={faChartLine} /> Relatórios</CustomLink>
          <CustomLink to="/configuracoes" className={styles.link}><FontAwesomeIcon icon={faGear} /> Configurações</CustomLink>
        </ul>
      </nav>
    </aside>
  );
}

interface CustomLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

function CustomLink({ to, children, className }: CustomLinkProps) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? `${styles.active}` : ''}>
      <Link to={to} className={className}>
        {children}
      </Link>
    </li>
  );
}

export default Sidebar;
