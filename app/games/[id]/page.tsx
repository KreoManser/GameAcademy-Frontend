// app/games/[id]/page.tsx
import Link from 'next/link';
import ModelsViewerWrapper from './ModelsViewerWrapper';

type Game = {
  title: string;
  description: string;
  models: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const MODELS_BASE = process.env.NEXT_PUBLIC_MINIO_MODELS_BASE_URL!;

export default async function GameOverview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${API_URL}/games/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Не удалось загрузить игру');
  const game: Game = await res.json();

  return (
    <main style={{ padding: 20 }}>
      <h1>{game.title}</h1>
      <p>{game.description}</p>

      {/* Динамический ModelsViewer теперь в клиентской обёртке */}
      <ModelsViewerWrapper models={game.models} baseUrl={MODELS_BASE} />

      <Link href={`/games/${id}/play`}>
        <button style={{ marginTop: 20 }}>Играть ▶️</button>
      </Link>
    </main>
  );
}