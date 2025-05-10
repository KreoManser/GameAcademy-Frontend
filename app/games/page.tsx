'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import styles from './games.module.css'
import { usePathname } from 'next/navigation'
import axios from 'axios'

type Game = {
  _id: string
  title: string
  description: string
  cover?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!
const AUTH_API = process.env.NEXT_PUBLIC_API_URL_API!
const IMAGES_BASE = process.env.NEXT_PUBLIC_MINIO_IMAGES_BASE_URL!

export default function GamesList() {
//   const router = useRouter()
  const pathname = usePathname()

  const [allGames, setAllGames] = useState<Game[]>([])
  const [searchResults, setSearchResults] = useState<Game[]>([])
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // роль пользователя
  const [userRole, setUserRole] = useState<string | null>(null)

  // подгружаем игры
  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then(r => r.json())
      .then((data: Game[]) => setAllGames(data))
  }, [])

  // поиск
  useEffect(() => {
    if (!q) {
      setSearchResults([])
      return
    }
    const url = new URL(`${API_URL}/games`)
    url.searchParams.set('q', q)
    fetch(url.toString())
      .then(r => r.json())
      .then((data: Game[]) => setSearchResults(data))
  }, [q])

  // загружаем роль из профиля
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const { sub: userId } = JSON.parse(atob(token.split('.')[1])) as { sub: string }
    axios.post(
      `${AUTH_API}/user/info`,
      { id: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => {
      setUserRole(res.data.profile.role)
    }).catch(() => {
      setUserRole(null)
    })
  }, [])

  // закрытие автодопа
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const tgt = e.target as Node
      if (
        inputRef.current &&
        dropdownRef.current &&
        !inputRef.current.contains(tgt) &&
        !dropdownRef.current.contains(tgt)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // позиционирование выпадашки
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  useEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 16,
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight: '70vh',
        overflowY: 'auto',
        zIndex: 2000,
      })
    }
  }, [open])

  const results = q ? searchResults : []

  return (
    <main>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1>Все проекты</h1>

          {/* рендерим кнопку только для Admin */}
          {userRole === 'Admin' && (
            <Link href="/upload">
              <button className={styles.uploadButton}>Новый проект</button>
            </Link>
          )}
        </header>

        <div className={styles.searchWrapper} key={pathname}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Поиск по названию, описанию или жанру…"
            className={styles.searchInput}
            value={q}
            onChange={e => { setQ(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
          />
        </div>
      </div>

      {open && q && createPortal(
        <>
          {results.length > 0 && <div className={styles.backdrop} />}
          <div ref={dropdownRef} style={dropdownStyle} className={styles.dropdown}>
            {results.length > 0 ? (
              results.map(g => (
                <Link
                  key={g._id}
                  href={`/games/${g._id}`}
                  className={styles.dropdownItem}
                >
                  <div className={styles.cardImage}>
                    {g.cover
                      ? <Image
                          src={`${IMAGES_BASE}/${encodeURIComponent(g.cover)}`}
                          alt={g.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                      : <div className={styles.cardIcon}>🎮</div>
                    }
                  </div>
                  <div className={styles.cardContent}>
                    <h2 className={styles.cardTitle}>{g.title}</h2>
                    <p className={styles.cardDesc}>{g.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.noResults}>Ничего не найдено</div>
            )}
          </div>
        </>,
        document.body
      )}

      <ul className={styles.list}>
        {allGames.map(g => (
          <li key={g._id} className={styles.card}>
            <Link href={`/games/${g._id}`} className={styles.cardLink}>
              <div className={styles.cardImage}>
                {g.cover
                  ? <Image
                      src={`${IMAGES_BASE}/${encodeURIComponent(g.cover)}`}
                      alt={g.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  : <div className={styles.cardIcon}>🎮</div>
                }
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{g.title}</h2>
                <p className={styles.cardDesc}>{g.description}</p>
                <button className={styles.cardButton}>Обзор</button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}