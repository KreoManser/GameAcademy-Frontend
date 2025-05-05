'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Добро пожаловать в мир <span className={styles.highlight}>игр</span>
        </h1>
        <p className={styles.subtitle}>
          ИТИС • Кафедра разработки видеоигр
        </p>
        <button
          className={styles.cta}
          onClick={() => router.push('/auth/login')}
        >
          Войти в мир игр
        </button>
      </div>
    </div>
  );
}