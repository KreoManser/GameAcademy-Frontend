'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './header.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    true
  );

  useEffect(() => {
    setIsLoggedIn(true);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/auth/login');
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.brand}>
        <Link href="/" className={styles.brandLink}>
          GameAcademy
        </Link>
      </h1>
      <nav className={styles.nav}>
        {isLoggedIn ? (
          <button onClick={handleLogout} className={styles.button}>
            Выход
          </button>
        ) : (
          <>
            <Link href="/auth/login" className={styles.link}>
              Войти
            </Link>
            <Link href="/auth/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </>
        )}
      </nav>
    </header>
);
}