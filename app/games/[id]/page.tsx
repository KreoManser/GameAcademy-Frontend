import Link from 'next/link';
import Image from 'next/image';
import ModelsViewerWrapper from './ModelsViewerWrapper';
import styles from './game-overview.module.css';

type Game = {
  title: string;
  description: string;
  models: string[];
  tags?: string[];
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
    <main className={styles.container}>
      <nav className={styles.breadcrumbs}>
        <Link href="/games" className={styles.breadcrumbLink}>Все проекты</Link> /
        <span> {game.title}</span>
      </nav>

      <div className={styles.headerRow}>
        <Link href="/games" className={styles.backButton}>
          ← Все игры
        </Link>
        <h1 className={styles.title}>{game.title}</h1>
      </div>

      <div className={styles.mediaPanel}>
        <div className={styles.media}>
          <Image
            src="/placeholder-poster.jpg"
            alt="Poster"
            fill
            className={styles.poster}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <aside className={styles.sidebar}>
          <Link href={`/games/${id}/play`} className={styles.button}>
            Играть ▶️
          </Link>
          <Link
            href={`https://github.com/your-repo/${id}`}
            target="_blank"
            className={styles.button}
          >
            GitHub
          </Link>
          {game.tags && (
            <div className={styles.tags}>
              {game.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </aside>
      </div>

    {game.models.length > 0 && (
        <section className={styles.modelsSection}>
          <h2 className={styles.modelsTitle}>3D Модели</h2>
          <div className={styles.modelsGrid}>
            <ModelsViewerWrapper models={game.models} baseUrl={MODELS_BASE} />
          </div>
        </section>
      )}

      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>Описание</h2>
        <p>{game.description}</p>
      </section>
    </main>
  );
}