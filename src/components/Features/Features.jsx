import React, { useState } from 'react';
import styles from './Features.module.scss';
import Button from '../Button/Button';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import { useRouter } from 'next/router';
import SignIn from '../SignIn/SignIn';
import Header from '../Header/Header';
import { useState, useEffect } from 'react';
import SignUp from '../SignUp/SignUp';
const Features = () => {
  const router = useRouter();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
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
  const handleClose = () => {
    // Logic to close the feature section or modal  
  }
  const handleToggle= () => {
    // Logic to close the feature section or modal  
  }
  

  return (
    <section className={styles.features}>
      <div className={styles.featuresContainer}>
        {/* Feature Card 1 */}
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <h1 className={styles.featureSource}>Youtube</h1>
            <h2 className={styles.featureTitle}>Video Downloader</h2>
          </div>
          
          <ul className={styles.featureList}>
            <li>Download Youtube videos by URL</li>
            <li>Diverse quality</li>
            <li>Fast download for every user</li>
          </ul>
          
          <div className={styles.featureAction}>
            <Button variant="other" onClick={() => router.push('/downloader')}>
              Try It
            </Button>
          </div>
        </div>
        
        {/* Feature Card 2 */}
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <h1 className={`${styles.featureSource} ${styles.featureSource_2}`}>Upload</h1>
            <h2 className={styles.featureTitle}>to Short Video Platform</h2>
          </div>
          
          <ul className={styles.featureList}>
            <li>TikTok, Reels API Integration</li>
            <li>Automatically post with hashtags</li>
            <li>Extract clips from video using AI</li>
          </ul>
          
          <div className={styles.featureAction}>
            <Button
              variant="primary"
              onClick={() => {
                if (typeof window !== 'undefined' && localStorage.getItem('userSession')) {
                  router.push('/projects');
                } else {
                  // alert('Please sign in to access this feature');
                  // router.push('/');
                  handleSignInClick();
                  
                }
              }}
            >
              {typeof window !== 'undefined' && localStorage.getItem('userSession') ? 'Extract Now' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
      {(showSignIn || showSignUp) && (
        <div className={styles.modalOverlay} onClick={handleCloseForm}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {showSignIn && <SignIn onClose={handleCloseForm} onToggleForm={toggleFormShow}/>}
            {showSignUp && <SignUp onClose={handleCloseForm} onToggleForm={toggleFormShow}/>}
          </div>
        </div>
    )}
    </section>
  
  );
};

export default Features;