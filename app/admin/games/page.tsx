'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './admin-games.module.css';
import { useRouter } from 'next/navigation';

type Game = { _id: string; title: string; cover?: string };

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3003/api/admin/games', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setGames(res.data)).catch(err => {
  const status = axios.isAxiosError(err) ? err.response?.status : null;
  if (status === 401 || status === 403) {
    router.push('/auth/login');
  }
});;
  }, [router]);

  const onDelete = async (id: string) => {
    if (!confirm('Удалить игру?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:3003/api/admin/games/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setGames(games.filter(g => g._id !== id));
  };

  return (
    <main className={styles.container}>
      <h1>Управление играми</h1>
      <ul className={styles.list}>
        {games.map(g => (
          <li key={g._id} className={styles.card}>
            <span>{g.title}</span>
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(g._id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}