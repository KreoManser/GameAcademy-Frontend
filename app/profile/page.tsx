// app/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './profile.module.css'

const AUTH_API = process.env.NEXT_PUBLIC_API_URL_API!
const GAMES_API = process.env.NEXT_PUBLIC_API_URL!

// Простой JWT-парсер для получения поля sub
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJwt<T extends Record<string, any>>(token: string): T {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = atob(base64)
  return JSON.parse(jsonPayload) as T
}

interface Profile {
  displayName: string
  email: string
  role: string
}

interface Game {
  _id: string
  title: string
  cover?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Не авторизованы')
        return
      }

      let userId: string
      try {
        userId = parseJwt<{ sub: string }>(token).sub
      } catch {
        setError('Невалидный токен')
        return
      }

      try {
        // 1) Получаем профиль
        const resProfile = await fetch(`${AUTH_API}/user/info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: userId }),
        })
        if (!resProfile.ok) throw new Error(`Ошибка ${resProfile.status}`)
        const { profile } = await resProfile.json() as { profile: Profile }
        setProfile(profile)

        // 2) Получаем игры этого пользователя
        const resGames = await fetch(
          `${GAMES_API}/games?uploader=${encodeURIComponent(profile.email)}`,
          { cache: 'no-store' }
        )
        if (!resGames.ok) throw new Error(`Ошибка ${resGames.status}`)
        const list = await resGames.json() as Game[]
        setGames(list)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message)
      }
    }

    loadProfile()
  }, [])

  if (error) {
    return <p className={styles.messageError}>{error}</p>
  }
  if (!profile) {
    return <p className={styles.message}>Загрузка...</p>
  }

  return (
    <main className={styles.container}>
      <section className={styles.profile}>
        <div className={styles.avatar}>
          {profile.displayName?.[0].toUpperCase() ?? 'U'}
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>{profile.displayName}</h1>
          <span className={styles.role}>{profile.role}</span>
        </div>
      </section>

      {games.length > 0 && (
        <section className={styles.projects}>
          <h2 className={styles.projectsTitle}>Мои проекты</h2>
          <div className={styles.grid}>
            {games.map((g) => (
              <Link href={`/games/${g._id}`} key={g._id} className={styles.card}>
                <div className={styles.cover}>
                  {g.cover ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MINIO_IMAGES_BASE_URL!}/${encodeURIComponent(g.cover)}`}
                      alt={g.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  ) : (
                    <div className={styles.placeholder}>🎮</div>
                  )}
                </div>
                <h3 className={styles.title}>{g.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}