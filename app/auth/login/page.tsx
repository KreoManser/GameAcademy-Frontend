'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../globals.css'; // Или импортируйте в layout.tsx

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ошибка авторизации');
      }
    }
  };

  return (
    <div className="container">
      <h1>Вход</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}