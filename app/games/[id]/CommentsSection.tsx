// app/games/[id]/CommentsSection.tsx
'use client';

import { useState } from 'react';
import styles from './comments.module.css';

type Comment = {
  _id: string;
  content: string;
  author: { displayName: string; role: string };
  createdAt: string;
  replies: Comment[];
};

export default function CommentsSection({ gameId }: { gameId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const BACKEND = process.env.NEXT_PUBLIC_API_URL_API;

  const fetchComments = async () => {
  const token = localStorage.getItem('token');
  if (!token) return; // или бросайте ошибку
  const res = await fetch(
    `${BACKEND}/comments?gameId=${encodeURIComponent(gameId)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
  );
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  const payload: { comments: Comment[] } = await res.json();
  setComments(payload.comments || []);
};

//   useEffect(() => {
//     fetchComments();
//   }, [gameId]);

  const post = async () => {
  const token = localStorage.getItem('token');
  if (!token) return alert('Войдите');
  const res = await fetch(
    `${BACKEND}/comments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ gameId, parent: replyTo, content: text }),
    }
  );
  if (!res.ok) throw new Error(`Ошибка при отправке: ${res.status}`);
  setText('');
  setReplyTo(null);
  await fetchComments();
};

  const renderList = (list: Comment[], indent = 0) => (
    <ul className={styles.list} style={{ marginLeft: indent * 20 }}>
      {list.map((c) => (
        <li key={c._id} className={styles.item}>
          <div className={styles.header}>
            <div className={styles.avatar}>{c.author.displayName[0]}</div>
            <span>{c.author.displayName}</span>
            <span>·</span>
            <span className={styles.role}>{c.author.role}</span>
            <span>·</span>
            <span className={styles.time}>
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
          <p className={styles.content}>{c.content}</p>
          <button
            className={styles.reply}
            onClick={() => setReplyTo(c._id)}
          >
            Ответить
          </button>
          {c.replies.length > 0 && renderList(c.replies, indent + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={styles.comments}>
      <h2>Комментарии</h2>
      <textarea
        className={styles.input}
        placeholder={replyTo ? 'Ваш ответ…' : 'Ваш комментарий…'}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className={styles.send}
        onClick={post}
        disabled={!text.trim()}
      >
        Отправить
      </button>
      {renderList(comments)}
    </section>
  );
}