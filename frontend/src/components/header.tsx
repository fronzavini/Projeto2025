import styles from '../styles/header.module.css';

import {useState} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';

function Header() {
    const [modal, setModal] = useState(false);

    const abrirModal = () => {
        setModal(!modal)
    }
    
  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <h1 className={styles.logo}>BellaDonna</h1>

        <button className={styles.icon}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>


        <div className={styles.right}>
            <FontAwesomeIcon icon={faBell} className={`${styles.icon_notificacao} ${styles.icon}`}/>
            <div className={styles.avatar}>
            <button 
            onClick={abrirModal}
            className={styles.botao_modal}>
                <img src="https://media.istockphoto.com/id/1386479313/pt/foto/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=rzUSobX0RTFPksl6-Pl28C5itfvrW3mug6NkFW7kPeQ="
                alt="Foto de perfil"
                className={styles.avatar}/>
            </button>
            </div>
        

            {modal && (
                <div className={styles.modal}>
                    <div className={styles.modal_conteudo}>
                        <button 
                        onClick={abrirModal}
                        className={styles.botao_fechar}>Fechar</button>
                        <h3>Nome usuário</h3>
                        <span>Configurações</span>
                        <button>Sair</button>
                    </div>
                </div>
                )}

        </div>
      
    </nav>
  );
}

export default Header;
