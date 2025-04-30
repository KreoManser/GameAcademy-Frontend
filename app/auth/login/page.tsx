'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/games');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3003/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Ошибка авторизации');
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      router.push('/games');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вход</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          suppressHydrationWarning
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Войти
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}