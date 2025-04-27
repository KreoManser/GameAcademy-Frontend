// app/games/[id]/play/page.tsx
import ClientGameWrapper from '../ClientGameWrapper';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// params — Promise<{ id: string }>
export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${API_URL}/games/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    return <p>Ошибка {res.status}: игра не найдена</p>;
  }
  const game = await res.json();

  return (
    <main style={{ padding: 20 }}>
      <h1>{game.title}</h1>
      <Link href={`/games/${id}`}>
        <button>← Назад к обзору</button>
      </Link>
      <div style={{ marginTop: 20 }}>
        <ClientGameWrapper prefix={game.prefix} />
      </div>
    </main>
  );
}