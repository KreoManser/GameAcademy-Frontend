'use client';

function parseJwt<T extends Record<string, unknown>>(token: string): T {
  const payload = token.split('.')[1];
  // atob возвращает строку, JSON.parse она же возвращает unknown
  return JSON.parse(atob(payload)) as T;
}

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './upload.module.css';

type JwtPayload = { sub: string; /* плюс остальные поля если нужны */ };

const GENRES = [
  'Экшен',
  'Приключения',
  'Адвенчура',
  'RPG',
  'Стратегия',
  'Головоломка',
  'Спортивная',
];

export default function UploadPage() {
  const router = useRouter();

  // текущий пользователь
  const [uploader, setUploader] = useState<string>('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    try {
      const { sub } = parseJwt<JwtPayload>(token);
      setUploader(sub);
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [addModels, setAddModels] = useState(false);
  const [models, setModels] = useState<FileList | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [videos, setVideos] = useState<FileList | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };
  const onModelsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setModels(e.target.files);
  };
  const onImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };
  const onVideosChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVideos(e.target.files);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Выберите ZIP-файл');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('description', description);
    form.append('uploader', uploader);
    // отправляем каждый жанр отдельно — NestJS соберёт их в массив
    selectedGenres.forEach((g) => form.append('genres', g));

    if (addModels && models) {
      Array.from(models).forEach((m) => form.append('models', m));
    }
    if (images) {
      Array.from(images).forEach((img) => form.append('images', img));
    }
    if (videos) {
      Array.from(videos).forEach((vid) => form.append('videos', vid));
    }

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/games`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    router.push('/games');
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Загрузить новую игру</h1>
      <form suppressHydrationWarning onSubmit={onSubmit} className={styles.form}>
        {/* Build ZIP */}
        <div className={styles.formGroup}>
          <label className={styles.label}>ZIP WebGL-билда:</label>
          <input
            type="file"
            accept=".zip"
            onChange={onFileChange}
            className={styles.fileInput}
            required
          />
        </div>

        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Название:</label>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Описание:</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Genres */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Жанры:</label>
          <div className={styles.checkboxList}>
            {GENRES.map((genre) => (
              <label key={genre} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>

        {/* Add Models */}
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            checked={addModels}
            onChange={() => setAddModels(!addModels)}
          />
          <label>Добавить 3D модели</label>
        </div>
        {addModels && (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Выбрать модели (.glb, .gltf и т.п.):
            </label>
            <input
              type="file"
              accept=".glb,.gltf"
              multiple
              onChange={onModelsChange}
              className={styles.fileInput}
            />
          </div>
        )}

        {/* Images */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Изображения игры:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImagesChange}
            className={styles.fileInput}
          />
        </div>

        {/* Videos */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Видео:</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={onVideosChange}
            className={styles.fileInput}
          />
        </div>

        {/* Submit */}
        <button type="submit" className={styles.submitButton}>
          Загрузить
        </button>
      </form>
    </main>
  );
}