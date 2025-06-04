import React from 'react';
import Head from 'next/head';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import styles from '../styles/Home.module.scss';
import Ellipse from '../components/Ellipse/Ellipse';

export default function Home() {
  return (
    <div className={styles.container}>
      
      <Head>
        <title>KKCD - AI Video Customer Service</title>
        <meta name="description" content="AI Video Customer Service and Satisfaction" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <Ellipse className={styles.Ellipse}></Ellipse>
      <main className={styles.main}>
        <Header />
        <Hero />
      </main>
    </div>
  );
}