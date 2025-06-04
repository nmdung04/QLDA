import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header/Header';
import styles from '../styles/Home.module.scss';
import Ellipse from '../components/Ellipse/Ellipse';
import ProjectList from '../components/ProjectList/ProjectList';

import { useRouter } from 'next/router';

export default function ProjectsPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('userSession')) {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Projects - KKCD AI Video Customer Service</title>
        <meta name="description" content="Manage your video projects" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Ellipse className={styles.Ellipse}></Ellipse>
      <main className={styles.main}>
        <Header />
        <ProjectList />
      </main>
    </div>
  );
}