import Link from 'next/link';
import Image from 'next/image';
import ModelsViewerWrapper from './ModelsViewerWrapper';
import MediaGallery from './MediaGallery';
import styles from './game-overview.module.css';
import { BreadcrumbsAndHeader } from './BreadcrumbsAndHeader';
import ClientCommentsSection from './ClientCommentsSection';
// import CommentsSection from './CommentsSection';

type Game = {
  title: string;
  description: string;
  models: string[];
  images: string[];
  videos: string[];
  genres: string[];
  cover?: string;
  playable: boolean;
  githubUrl: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const MODELS_BASE = process.env.NEXT_PUBLIC_MINIO_MODELS_BASE_URL!;
const IMAGES_BASE = process.env.NEXT_PUBLIC_MINIO_IMAGES_BASE_URL!;
const VIDEOS_BASE = process.env.NEXT_PUBLIC_MINIO_VIDEOS_BASE_URL!;

export default async function GameOverview({
  params,
  searchParams
}: {
  params: { id: string },
  searchParams: { from?: string }
}) {
  const { id } = params;
  const from = searchParams.from
  const res = await fetch(`${API_URL}/games/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Не удалось загрузить игру');
  const game: Game = await res.json();

  const playHref = from
    ? `/games/${id}/play?from=${from}`
    : `/games/${id}/play`

  return (
    <main className={styles.container}>
      <BreadcrumbsAndHeader title={game.title} id={id} />

      {/* === ТОП: две колонки === */}
      <div className={styles.topRow}>
        {/* 1. Большая медиапанель */}
        <div className={`${styles.glassBlock} ${styles.mediaBlock}`}>
          <MediaGallery
            images={game.images}
            videos={game.videos}
            imagesBase={IMAGES_BASE}
            videosBase={VIDEOS_BASE}
          />
        </div>

        {/* 2. Боковая панель с cover + кнопками */}
        <div className={`${styles.glassBlock} ${styles.sidebarBlock}`}>
          {game.cover && (
            <div className={styles.coverContainer}>
              <Image
                src={`${IMAGES_BASE}/${encodeURIComponent(game.cover)}`}
                alt={game.title}
                fill
                className={styles.coverImage}
                unoptimized
              />
            </div>
          )}
          {game.genres?.length > 0 && (
            <div className={styles.tags}>
              {game.genres.map(g => (
                <span key={g} className={styles.tag}>{g}</span>
              ))}
            </div>
          )}
          {game.playable && (
            <Link href={playHref} className={styles.button}>Играть ▶️</Link>
          )}
          {game.githubUrl && (
            <Link href={game.githubUrl} target="_blank" className={styles.button}>GitHub</Link>
          )}
        </div>
      </div>

      {/* === Блок 3: 3D модели === */}
      {game.models.length > 0 && (
        <section className={`${styles.glassBlock} ${styles.modelsSection}`}>
          <div className={styles.modelsGrid}>
            <ModelsViewerWrapper models={game.models} baseUrl={MODELS_BASE} />
          </div>
        </section>
      )}

      {/* === Блок 4: Описание === */}
      <section className={`${styles.glassBlock} ${styles.details}`}>
        <h2 className={styles.sectionTitle}>Описание</h2>
        <p>{game.description}</p>
      </section>

      {/* === Блок 5: Комментарии === */}
      <section className={styles.commentsSection}>
        <ClientCommentsSection gameId={id} />
      </section>

    </main>
  );
}