'use client'

import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import styles from './game-overview.module.css'

interface Props {
  title: string
  id: string
}

export function BreadcrumbsAndHeader({ title, id }: Props) {
  const search = useSearchParams()
  const pathname = usePathname()
  const from = search.get('from')
  const isPlay = pathname.endsWith('/play')

  const rootLink = from === 'profile'
    ? { href: '/profile', text: 'Мои проекты' }
    : { href: '/games',   text: 'Все проекты' }

  const overviewLink = from === 'profile'
    ? { href: `/games/${id}?from=profile`, text: title }
    : { href: `/games/${id}`,             text: title }

  return (
    <>
      <nav className={styles.breadcrumbs}>
        <Link href={rootLink.href} className={styles.breadcrumbLink}>
          {rootLink.text}
        </Link>
        {' / '}
        {isPlay ? (
          <>
            <Link href={overviewLink.href} className={styles.breadcrumbLink}>
              {overviewLink.text}
            </Link>
            {' / '}
            <span>Play</span>
          </>
        ) : (
          <span>{overviewLink.text}</span>
        )}
      </nav>

      <div className={styles.headerRow}>
        <Link
          href={isPlay ? overviewLink.href : rootLink.href}
          className={styles.backButton}
        >
          {isPlay
            ? '← Назад к обзору'
            : from === 'profile'
              ? '← Назад в профиль'
              : '← Все игры'
          }
        </Link>
        <h1 className={styles.title}>
          {isPlay ? `${title} (Запущено)` : title}
        </h1>
      </div>
    </>
  )
}