import ClientGameWrapper from './ClientGameWrapper';
import Link from 'next/link';
import styles from './play.module.css';

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    return <p>Ошибка {res.status}: игра не найдена</p>;
  }
  const game = await res.json();

  return (
    <main className={styles.container}>
      <nav className={styles.breadcrumbs}>
        <Link href="/games" className={styles.breadcrumbLink}>Игры</Link> /
        <Link href={`/games/${id}`} className={styles.breadcrumbLink}> {game.title}</Link> /
        <span> Play </span>
      </nav>

      <div className={styles.headerRow}>
        <Link href={`/games/${id}`} className={styles.backButton}>
          ← Назад к обзору
        </Link>
        <h1 className={styles.title}>{game.title}</h1>
      </div>

      <div className={styles.gameWrapper}>
        {!game && <p className={styles.gameLoading}>Загрузка...</p>}
        <ClientGameWrapper prefix={game.prefix} canvasClass={styles.unityCanvas} />
      </div>
    </main>
  );
}