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

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <li><a href="/" className={styles.link}><FontAwesomeIcon icon={faHome} /> Home</a></li>
          <li><a href="/vendas" className={styles.link}><FontAwesomeIcon icon={faCashRegister} /> Vendas</a></li>
          <li><a href="/produtos" className={styles.link}><FontAwesomeIcon icon={faBoxOpen} /> Produtos</a></li>
          <li><a href="/estoque" className={styles.link}><FontAwesomeIcon icon={faWarehouse} /> Estoque</a></li>
          <li><a href="/financeiro" className={styles.link}><FontAwesomeIcon icon={faMoneyCheckDollar} /> Financeiro</a></li>
          <li><a href="/descontos" className={styles.link}><FontAwesomeIcon icon={faTag} /> Descontos</a></li>
          <li><a href="/clientes" className={styles.link}><FontAwesomeIcon icon={faUsers} /> Clientes</a></li>
          <li><a href="/funcionarios" className={styles.link}><FontAwesomeIcon icon={faUserTie} /> Funcionários</a></li>
          <li><a href="/fornecedores" className={styles.link}><FontAwesomeIcon icon={faTruck} /> Fornecedores</a></li>
          <li><a href="/relatorios" className={styles.link}><FontAwesomeIcon icon={faChartLine} /> Relatórios</a></li>
          <li><a href="/configuracoes" className={styles.link}><FontAwesomeIcon icon={faGear} /> Configurações</a></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
