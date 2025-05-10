'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './admin-games.module.css';

interface Game {
  _id: string;
  title: string;
  uploader: string;
  createdAt: string;
}

interface Duplicate {
  _id: string;
  hash: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  createdAt: string;
}

export default function AdminGamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [dups, setDups] = useState<Duplicate[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.replace('/');

    axios.post(
      'http://localhost:3003/api/user/info',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => {
      if (res.data.profile.role !== 'Admin') router.replace('/');
    }).catch(() => router.replace('/'));
  }, [router]);

  useEffect(() => {
    axios.get<{ games: Game[] }>('http://localhost:3001/api/admin/games')
      .then(res => setGames(res.data.games))
      .catch(() => setError('Не удалось загрузить игры'));

    axios.get<{ duplicates: Duplicate[] }>('http://localhost:3001/api/admin/duplicates')
      .then(res => setDups(res.data.duplicates))
      .catch(() => setError('Не удалось загрузить историю дубликатов'));
  }, []);

  const deleteGame = async (id: string) => {
    if (!confirm('Удалить эту игру?')) return;
    try {
      await axios.post('http://localhost:3001/api/admin/games/delete', { id });
      setGames(g => g.filter(x => x._id !== id));
    } catch {
      alert('Ошибка при удалении игры');
    }
  };

  const deleteDup = async (id: string) => {
    if (!confirm('Удалить запись дубликата?')) return;
    try {
      await axios.post('http://localhost:3003/api/admin/duplicates/delete', { id });
      setDups(d => d.filter(x => x._id !== id));
    } catch {
      alert('Ошибка при удалении дубликата');
    }
  };

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1>Админ-панель: Игры и Дубликаты</h1>

      <section className={styles.section}>
        <h2>Все игры</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Uploader</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {games.map(g => (
              <tr key={g._id}>
                <td>{g.title}</td>
                <td>{g.uploader}</td>
                <td>{new Date(g.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => deleteGame(g._id)} className={styles.deleteBtn}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2>История дубликатов</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>UUID-Hashed</th>
              <th>Meta</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dups.map(d => (
              <tr key={d._id}>
                <td className={styles.hashCell}>{d.hash}</td>
                <td><pre className={styles.meta}>{JSON.stringify(d.metadata)}</pre></td>
                <td>
                  <button onClick={() => deleteDup(d._id)} className={styles.deleteBtn}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}