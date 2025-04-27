'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
    <main style={{ padding: 20 }}>
      <h1>Загрузить новую игру</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            ZIP WebGL-билда:
            <input type="file" accept=".zip" onChange={onFileChange} />
          </label>
        </div>
        <div>
          <label>
            Название:
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Описание:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={addModels}
              onChange={() => setAddModels(!addModels)}
            />{' '}
            Добавить 3D модели
          </label>
        </div>
        {addModels && (
          <div>
            <label>
              Выбрать модели (.glb, .gltf и т.п.):
              <input
                type="file"
                accept=".glb,.gltf"
                multiple
                onChange={onModelsChange}
              />
            </label>
          </div>
        )}
        <button type="submit">Загрузить</button>
      </form>
    </main>
  );
}