import React from 'react';
import Head from 'next/head';
import Header from '../components/Header/Header';
import styles from '../styles/Home.module.scss';
import Ellipse from '../components/Ellipse/Ellipse';
import Features from '../components/Features/Features';

export default function FeaturesPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Features - KKCD AI Video Customer Service</title>
        <meta name="description" content="Features of KKCD - AI Video Customer Service and Satisfaction" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Ellipse className={styles.Ellipse}></Ellipse>
      <main className={styles.main}>
        <Header />
        <Features />
      </main>
    </div>
  );
}