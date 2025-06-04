import React from 'react';
import styles from './About.module.scss';
import Image from 'next/image';
import facebook from '../../../public/assets/about/facebook.svg'
import youtube from '../../../public/assets/about/youtube.svg'
import instagram from '../../../public/assets/about/Instagram.svg'
import tiktok from '../../../public/assets/about/tiktok.svg'
import picture from '../../../public/assets/about/about.png'
import Link from 'next/link';

const About = () => {
  return (
    <section className={styles.about}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          AI Video Customer Service and Satisfaction
        </h1>
        <p className={styles.description}>
          Utilizing AI to personalize, enhance, and optimize your experience,
          ensuring seamless, efficient, and smooth interactions throughout.
        </p>
        
        <div className={styles.partnersSection}>
          <h3 className={styles.partnersTitle}>Co.op with</h3>
          <div className={styles.socialIcons}>
            {/* Placeholder for social media icons */}
            <Link href="#">
                <Image src={facebook}></Image>
            </Link>
            <Link href="#">
                <Image src={youtube}></Image>
            </Link>
            <Link href="#">
                <Image src={tiktok}></Image>
            </Link>
            <Link href="#">
                <Image src={instagram}></Image>
            </Link>
          </div>
        </div>
      </div>
      
      <div className={styles.imageContainer}>
          <Image src={picture}></Image>
      </div>
    </section>
  );
};

export default About;