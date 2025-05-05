'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './header.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuOpen &&
        avatarWrapperRef.current &&
        !avatarWrapperRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand} onClick={() => router.push('/')}>
        GameAcademy
      </div>

      {isLoggedIn ? (
        <div ref={avatarWrapperRef} className={styles.avatarWrapper}>
          <div
            className={styles.avatar}
            onClick={() => setMenuOpen(v => !v)}
          >
            UA
          </div>
          {menuOpen && (
            <nav className={styles.menu}>
              <Link href="/" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                Главная
              </Link>
              <Link href="/games" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                Игры
              </Link>
              <button
                className={styles.menuLogout}
                onClick={handleLogout}
              >
                Выйти
              </button>
            </nav>
          )}
        </div>
      ) : (
        <nav className={styles.nav}>
          <Link href="/auth/login" className={styles.navLink}>
            Войти
          </Link>
          <Link href="/auth/register" className={styles.navLink}>
            Регистрация
          </Link>
        </nav>
      )}
      <div className={styles.spacer} />
    </header>
  );
}