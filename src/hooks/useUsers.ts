import { useState, useEffect } from 'react';
import type { User } from '../types';

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('https://jsonplaceholder.typicode.com/users', {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки');
        return res.json();
      })
      .then(setUsers)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Не удалось загрузить контакты');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { users, loading, error };
}
