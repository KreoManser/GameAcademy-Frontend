'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './upload.module.css';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [addModels, setAddModels] = useState(false);
  const [models, setModels] = useState<FileList | null>(null);
  const router = useRouter();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };
  const onModelsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setModels(e.target.files);
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Выберите ZIP-файл');
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('description', description);
    if (addModels && models) {
      Array.from(models).forEach((m) => form.append('models', m));
    }
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/games`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    router.push('/games');
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Загрузить новую игру</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            ZIP WebGL-билда:
          </label>
          <input
            type="file"
            accept=".zip"
            onChange={onFileChange}
            className={styles.fileInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Название:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>
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
        <button type="submit" className={styles.submitButton}>
          Загрузить
        </button>
      </form>
    </main>
  );
}