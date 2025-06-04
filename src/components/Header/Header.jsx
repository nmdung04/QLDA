import React, { useState } from 'react';
import Button from '../Button/Button';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import styles from './Header.module.scss';
import Link from 'next/link';
import Image from 'next/image';

import logo from '../../../public/assets/logo/logo.png';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const handleCloseForm = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  const toggleFormShow = () => {
    if (showSignIn) {
      setShowSignIn(false);
      setShowSignUp(true);
    } else if (showSignUp) {
      setShowSignUp(false);
      setShowSignIn(true);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
              <Image src={logo}></Image>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          <ul>
            <li><Link href="/features"><span>Features</span></Link></li>
            <li><Link href="/about"><span>About</span></Link></li>
            <li><Link href="/projects"><span>Projects</span></Link></li>
          </ul>
        </nav>
        
        <div className={styles.auth}>
          <Button onClick={handleSignInClick} variant='other'>
            <span className={styles.signIn}>Sign in</span>
          </Button>
          <Button onClick={handleSignUpClick} variant='secondary'>
            <span className={styles.signUp}>Sign up</span>
          </Button>
        </div>
      </header>

      {(showSignIn || showSignUp) && (
        <div className={styles.modalOverlay} onClick={handleCloseForm} >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {showSignIn && <SignIn onClose={handleCloseForm} onToggleForm={toggleFormShow}/>}
            {showSignUp && <SignUp onClose={handleCloseForm} onToggleForm={toggleFormShow}/>}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;