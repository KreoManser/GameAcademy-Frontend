import ClientGameWrapper from './ClientGameWrapper';
import styles from './play.module.css';
import { BreadcrumbsAndHeader } from '../BreadcrumbsAndHeader';

export default async function PlayPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    return <p>Ошибка {res.status}: игра не найдена</p>;
  }
  const game = await res.json();

  return (
    <main className={styles.container}>
    <BreadcrumbsAndHeader title={game.title} id={id} />

      <div className={styles.gameWrapper}>
        {!game && <p className={styles.gameLoading}>Загрузка...</p>}
        <ClientGameWrapper prefix={game.prefix} canvasClass={styles.unityCanvas} />
      </div>
    </main>
  );
}