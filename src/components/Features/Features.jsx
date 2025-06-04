import React from 'react';
import styles from './Features.module.scss';
import Button from '../Button/Button';
import { useRouter } from 'next/router';

const Features = () => {
  const router = useRouter();

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
            <Button variant="primary" onClick={() => {}}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;