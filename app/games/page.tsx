// app/games/page.tsx
import Link from 'next/link';

type Game = { _id: string; title: string; description: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function GamesList() {
  const res = await fetch(`${API_URL}/games`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Не удалось загрузить список игр');
  const games: Game[] = await res.json();

  return (
    <main style={{ padding: 20 }}>
      <h1>Список игр</h1>
      <Link href="/upload">
        <button>➕ Загрузить новую игру</button>
      </Link>
      <ul>
        {games.map((g) => (
          <li key={g._id} style={{ margin: '10px 0' }}>
            <h2>{g.title}</h2>
            <p>{g.description}</p>
            <Link href={`/games/${g._id}`}>
              <button>Обзор ▶️</button>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}