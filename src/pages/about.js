import React from 'react';
import Head from 'next/head';
import Header from '../components/Header/Header';
import styles from '../styles/Home.module.scss';
import Ellipse from '../components/Ellipse/Ellipse';
import About from '../components/About/About';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About - KKCD AI Video Customer Service</title>
        <meta name="description" content="About KKCD - AI Video Customer Service and Satisfaction" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Ellipse className={styles.Ellipse}></Ellipse>
      <main className={styles.main}>
        <Header />
        <About />
      </main>
    </div>
  );
}