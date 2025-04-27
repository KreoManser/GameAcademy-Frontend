'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../globals.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        'http://localhost:3003/api/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, displayName }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Ошибка регистрации');
        return;
      }

      // Сохраняем токен так же, как в логине:
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }

      // Перенаправляем на защищённую страницу
      router.push('/auth/login');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Ошибка регистрации'
      );
    }
  };

  return (
    <div className="container">
      <h1>Регистрация</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Имя"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}