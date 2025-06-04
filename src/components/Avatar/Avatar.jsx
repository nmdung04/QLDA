import { useCallback } from 'react';
import Image from "next/image";
import styles from './Avatar.module.scss';

import avatar from "../../../public/assets/avatar/avatar.svg"
import logout from "../../../public/assets/avatar/logout.svg"

const Logout = () => {
  	
  	const onLogoutContainerClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (
    		<div className={styles.logout} >
      			<div className={styles.button}>
        			<Image className={styles.vectorIcon} width={20} height={20} sizes="100vw" alt="" src={avatar} />
      			</div>
      			<button onClick={onLogoutContainerClick}>
                  <Image className={styles.vectorIcon1} width={40} height={40} sizes="100vw" alt="" src={logout} />
                  <span>Log Out</span>
                </button>
    		</div>);
};

export default Logout;
