// app/admin/users/page.tsx  (или где у вас AdminUsersPage)
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './admin-users.module.css';

interface User {
  email: string;
  displayName: string;
  role: string;
}

interface UsersResponse {
  users: User[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios
      .get<UsersResponse>('http://localhost:3003/api/user/users')
      .then(res => setUsers(res.data.users))
      .catch(() => setError('Не удалось загрузить список пользователей'));
  }, []);

  const onRoleChange = async (email: string, newRole: string) => {
    await axios.post('http://localhost:3003/api/user/users/change-role', { email, newRole });
    setUsers(u => u.map(x => x.email === email ? { ...x, role: newRole } : x));
  };

  const onDelete = async (email: string) => {
    if (!confirm(`Удалить пользователя ${email}?`)) return;
    try {
      await axios.post('http://localhost:3003/api/user/delete', { email });
      setUsers(u => u.filter(x => x.email !== email));
    } catch {
      alert('Ошибка при удалении пользователя');
    }
  };

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1>Управление пользователями</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Имя</th>
            <th>Роль</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.email}>
              <td>{u.email}</td>
              <td>{u.displayName}</td>
              <td>
                <select
                  value={u.role}
                  onChange={e => onRoleChange(u.email, e.target.value)}
                >
                  {['Guest','Student','Teacher','Admin'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(u.email)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}