import { useState, useMemo } from 'react';
import { useUsers } from './hooks/useUsers';
import { useFavorites } from './hooks/useFavorites';
import { useDebounce } from './hooks/useDebounce';
import { SearchInput } from './components/SearchInput/SearchInput';
import { ContactList } from './components/ContactList/ContactList';
import styles from './App.module.css';

function App() {
  const { users, loading, error } = useUsers();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredUsers = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    const filtered = query
      ? users.filter((user) => user.name.toLowerCase().includes(query))
      : users;

    return [...filtered].sort((a, b) => {
      const aFav = isFavorite(a.id);
      const bFav = isFavorite(b.id);
      if (aFav === bFav) return 0;
      return aFav ? -1 : 1;
    });
  }, [users, debouncedSearch, isFavorite]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Контакты</h1>
      </header>

      <main className={styles.main}>
        <SearchInput value={search} onChange={setSearch} />

        {loading && <p className={styles.status}>Загрузка...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <ContactList
            users={filteredUsers}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>
    </div>
  );
}

export default App;
