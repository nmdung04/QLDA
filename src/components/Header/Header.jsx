import React, { useState, useEffect } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userSession'));
    const handler = () => setIsLoggedIn(!!localStorage.getItem('userSession'));
    window.addEventListener('userSessionChanged', handler);
    return () => window.removeEventListener('userSessionChanged', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('userSessionChanged'));
    window.location.href = '/';
  };

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
            <li>
              <a
                href={isLoggedIn ? "/projects" : "#"}
                onClick={e => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowSignIn(true);
                    setShowSignUp(false);
                  }
                }}
              >
                <span>Projects</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className={styles.auth}>
          {isLoggedIn ? (
            <Button onClick={handleLogout} variant='other'>
              <span className={styles.signIn}>Logout</span>
            </Button>
          ) : (
            <>
              <Button onClick={handleSignInClick} variant='other'>
                <span className={styles.signIn}>Sign in</span>
              </Button>
              <Button onClick={handleSignUpClick} variant='secondary'>
                <span className={styles.signUp}>Sign up</span>
              </Button>
            </>
          )}
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