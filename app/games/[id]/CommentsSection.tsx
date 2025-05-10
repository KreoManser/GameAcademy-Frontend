'use client'

import { useEffect, useState } from 'react'
import styles from './comments.module.css'

type Comment = {
  _id: string
  content: string
  author: { displayName: string; role: string }
  createdAt: string
  replies: Comment[]
}

const MAX_DEPTH = 3  // не углубляемся дальше, чем в 3 уровня

export default function CommentsSection({ gameId }: { gameId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const BACKEND = process.env.NEXT_PUBLIC_API_URL_API!

  async function fetchComments() {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch(`${BACKEND}/comments?gameId=${encodeURIComponent(gameId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`Ошибка ${res.status}`)
    const { comments: data } = (await res.json()) as { comments: Comment[] }
    setComments(data)
  }

  useEffect(() => {
    fetchComments()
  }, [gameId])

  async function post() {
    const token = localStorage.getItem('token')
    if (!token) return alert('Войдите')
    const res = await fetch(`${BACKEND}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ gameId, parent: replyTo, content: text }),
    })
    if (!res.ok) throw new Error(`Ошибка при отправке: ${res.status}`)
    setText('')
    setReplyTo(null)
    await fetchComments()
  }

  const renderList = (list: Comment[], depth = 0) => {
    // отступ и вертикальная линия для вложенных
    const indent = depth > 0 ? Math.min(depth, MAX_DEPTH) * 20 : 0
    const listStyle: React.CSSProperties = {
      marginLeft: indent,
      paddingLeft: depth > 0 ? 12 : 0,
      borderLeft: depth > 0 ? '2px solid rgba(0,0,0,0.1)' : undefined,
    }

    return (
      <ul className={styles.list} style={listStyle}>
        {list.map(c => (
          <li
            key={c._id}
            className={`${styles.item} ${depth === 0 ? styles.topItem : ''}`}
          >
            <div className={styles.header}>
              <div className={styles.avatar}>{c.author.displayName[0]}</div>
              <span className={styles.name}>{c.author.displayName}</span>
              <span className={styles.sep}>·</span>
              <span className={styles.role}>{c.author.role}</span>
              <span className={styles.sep}>·</span>
              <span className={styles.time}>
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            <p className={styles.content}>{c.content}</p>

            <div className={styles.actionsRow}>
              {/* Скрываем кнопку, если под этим комментом уже открыта форма */}
              {replyTo !== c._id && (
                <button
                  className={styles.reply}
                  onClick={() => {
                    setReplyTo(c._id)
                    setText(`@${c.author.displayName}, `)
                  }}
                >
                  Ответить
                </button>
              )}
            </div>

            {/* inline-форма под этим комментом */}
            {replyTo === c._id && (
              <div className={styles.inlineForm}>
                <textarea
                  className={styles.input}
                  placeholder="Ваш ответ…"
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <div className={styles.buttonsRow}>
                  <button
                    className={styles.send}
                    onClick={post}
                    disabled={!text.trim()}
                  >
                    Отправить
                  </button>
                  <button
                    className={styles.cancel}
                    onClick={() => {
                      setReplyTo(null)
                      setText('')
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* рекурсия для вложенных ответов */}
            {c.replies.length > 0 && renderList(c.replies, depth + 1)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className={styles.comments}>
      <h2>Комментарии</h2>

      {/* форма для корневого комментария */}
      {replyTo === null && (
        <div className={styles.inlineForm}>
          <textarea
            className={styles.input}
            placeholder="Ваш комментарий…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button
            className={styles.send}
            onClick={post}
            disabled={!text.trim()}
          >
            Отправить
          </button>
        </div>
      )}

      {renderList(comments)}
    </section>
  )
}