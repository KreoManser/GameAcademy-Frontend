
import Link from 'next/link';
import styles from './games.module.css';

type Game = { _id: string; title: string; description: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default async function GamesList() {
  const res = await fetch(`${API_URL}/games`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Не удалось загрузить список проектов');
  const games: Game[] = await res.json();

  return (
    <main>
      <header className={styles.pageHeader}>
        <h1>Все проекты</h1>
        <Link href="/upload">
          <button className={styles.uploadButton}>➕ Загрузить новую игру</button>
        </Link>
      </header>

      <ul className={styles.list}>
        {games.map((g) => (
          <li key={g._id} className={styles.card}>
            <Link href={`/games/${g._id}`} className={styles.cardLink}>
              <div className={styles.cardImage}>🎮</div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{g.title}</h2>
                <p className={styles.cardDesc}>{g.description}</p>
                <button className={styles.cardButton}>Обзор ▶️</button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}