import React from 'react';
import styles from './Hero.module.scss';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          AI Video Customer Service<br />
          and Satisfaction
        </h1>
        <p className={styles.subtitle}>
          Utilizing AI to personalize, enhance, and optimize your experience,
          ensuring seamless, efficient, and smooth interactions throughout.
        </p>

      </div>
    </section>
  );
};

export default Hero;