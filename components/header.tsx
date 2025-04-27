'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // При любом изменении пути (в том числе после router.push('/games'))
  // Заново проверяем токен в localStorage
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      <h1 className="text-xl font-bold">
        <Link href="/">GameAcademy</Link>
      </h1>
      <nav className="space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            Выход
          </button>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="px-3 py-1 border rounded hover:bg-gray-200"
            >
              Войти
            </Link>
            <Link
              href="/auth/register"
              className="px-3 py-1 border rounded hover:bg-gray-200"
            >
              Зарегистрироваться
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}