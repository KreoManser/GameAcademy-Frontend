'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import styles from './games.module.css'

type Game = {
  _id: string
  title: string
  description: string
  cover?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!
const IMAGES_BASE = process.env.NEXT_PUBLIC_MINIO_IMAGES_BASE_URL!

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([])
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchGames = async () => {
      const url = new URL(`${API_URL}/games`)
      if (q) url.searchParams.set('q', q)
      const res = await fetch(url.toString())
      setGames(await res.json())
    }
    fetchGames()
  }, [q])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  useEffect(() => {
    if (open && inputRef.current) {
      const r = inputRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'absolute',
        top: r.bottom + window.scrollY + 4,
        left: r.left + window.scrollX,
        width: r.width,
        maxHeight: '70vh',
        overflowY: 'auto',
        zIndex: 2000,
      })
    }
  }, [open])

  return (
    <main>
      {/* контейнер с паддингом, совпадает с отступами грида */}
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1>Все проекты</h1>
          <Link href="/upload">
            <button className={styles.uploadButton}>➕ Новый проект</button>
          </Link>
        </header>

        <div className={styles.searchWrapper}>
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
        <div style={dropdownStyle} className={styles.dropdown}>
          {games.length > 0 ? games.map(g => (
            <Link
              key={g._id}
              href={`/games/${g._id}`}
              className={styles.dropdownItem}
              onClick={() => setOpen(false)}
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
          )) : (
            <div className={styles.noResults}>Ничего не найдено</div>
          )}
        </div>,
        document.body
      )}

      {!open && (
        <ul className={styles.list}>
          {games.map(g => (
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
                  <button className={styles.cardButton}>Обзор ▶️</button>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}