'use client';

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import styles from './upload.module.css';

function parseJwt<T extends Record<string, unknown>>(token: string): T {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload)) as T;
}

type JwtPayload = { sub: string };

const ALL_GENRES = [
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

  const [uploader, setUploader] = useState<string>('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    try {
      setUploader(parseJwt<JwtPayload>(token).sub);
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  const [playable, setPlayable] = useState(false);
  const [gitUrl, setGitUrl] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Жанры мультиселект
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreSearch, setGenreSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const genreRef = useRef<HTMLDivElement>(null);
  const genreInputRef = useRef<HTMLInputElement>(null);

  // Дополнительные файлы
  const [addModels, setAddModels] = useState(false);
  const [models, setModels] = useState<FileList | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [videos, setVideos] = useState<FileList | null>(null);

  // Хэндлеры
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
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setGenreSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredGenres = ALL_GENRES.filter(
    g =>
      g.toLowerCase().includes(genreSearch.toLowerCase()) &&
      !selectedGenres.includes(g)
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (playable && !zipFile) {
      alert('Выберите ZIP-файл для WebGL-билда');
      return;
    }
    if (!cover) {
      alert('Выберите главное фото');
      return;
    }
    if (!playable && !gitUrl) {
      alert('Укажите ссылку на GitHub');
      return;
    }
    if ((!images || images.length === 0) && (!videos || videos.length === 0)) {
      alert('Загрузите хотя бы одно изображение или видео');
      return;
    }

    const form = new FormData();
    if (playable && zipFile) form.append('file', zipFile);
    form.append('cover', cover);
    form.append('githubUrl', gitUrl);
    form.append('title', title);
    form.append('description', description);
    form.append('uploader', uploader);

    selectedGenres.forEach(g => form.append('genres', g));

    if (addModels && models) {
      Array.from(models).forEach(m => form.append('models', m));
    }
    if (images) {
      Array.from(images).forEach(img => form.append('images', img));
    }
    if (videos) {
      Array.from(videos).forEach(v => form.append('videos', v));
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/games`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      router.push('/games');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>;
        if (axiosErr.response?.status === 409) {
          alert(`Ошибка: Обнаружен дубликат`);
          return;
        }
      }
      alert(`Не удалось загрузить игру: ${err instanceof Error ? err.message : err}`);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Загрузить новую игру</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        {/* Играбельность */}
        <label className={styles.checkboxGroup}>
          <input
            type="checkbox"
            checked={playable}
            onChange={() => setPlayable(v => !v)}
          />
          Играбельная в браузере (ZIP WebGL)
        </label>

        {/* ZIP при необходимости */}
        {playable && (
          <div className={styles.formGroup}>
            <label>ZIP WebGL-билда:</label>
            <input
              type="file"
              accept=".zip"
              onChange={e => e.target.files && setZipFile(e.target.files[0])}
              className={styles.fileInput}
            />
          </div>
        )}

        {/* GitHub URL */}
        <div className={styles.formGroup}>
          <label>GitHub URL:</label>
          <input
            type="url"
            value={gitUrl}
            onChange={e => setGitUrl(e.target.value)}
            placeholder="https://github.com/..."
            className={styles.input}
          />
        </div>

        {/* Cover */}
        <div className={styles.formGroup}>
          <label>Главное фото (cover):</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => e.target.files && setCover(e.target.files[0])}
            className={styles.fileInput}
          />
        </div>

        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Название:</label>
          <input
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Описание:</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Жанры */}
        <div className={styles.formGroup} ref={genreRef}>
          <label className={styles.label}>Жанры:</label>
          <div className={styles.genreSelect}>
            <div className={styles.selectedContainer} onClick={() => setDropdownOpen(true)}>
              {selectedGenres.map(g => (
                <span key={g} className={styles.genreBadge}>
                  {g}{' '}
                  <button type="button" onClick={() => toggleGenre(g)}>
                    ×
                  </button>
                </span>
              ))}
              <input
                ref={genreInputRef}
                type="text"
                placeholder="Поиск жанров…"
                className={styles.genreInput}
                value={genreSearch}
                onChange={e => {
                  setGenreSearch(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
              />
            </div>
            {dropdownOpen && (
              <ul className={styles.genreDropdown}>
                {filteredGenres.length > 0 ? (
                  filteredGenres.map(g => (
                    <li
                      key={g}
                      className={styles.genreItem}
                      onClick={() => {
                        toggleGenre(g);
                        setGenreSearch('');
                        genreInputRef.current?.focus();
                      }}
                    >
                      {g}
                    </li>
                  ))
                ) : (
                  <li className={styles.noResults}>Нет жанров</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* 3D модели */}
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            checked={addModels}
            onChange={() => setAddModels(v => !v)}
          />
          <label>Добавить 3D модели</label>
        </div>
        {addModels && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Выбрать модели (.glb, .gltf):</label>
            <input
              type="file"
              accept=".glb,.gltf"
              multiple
              onChange={onModelsChange}
              className={styles.fileInput}
            />
          </div>
        )}

        {/* Изображения */}
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

        {/* Видео */}
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