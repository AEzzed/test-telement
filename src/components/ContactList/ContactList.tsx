import type { User } from '../../types';
import { ContactCard } from '../ContactCard/ContactCard';
import styles from './ContactList.module.css';

interface ContactListProps {
  users: User[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
}

export function ContactList({ users, isFavorite, onToggleFavorite }: ContactListProps) {
  if (users.length === 0) {
    return <p className={styles.empty}>Ничего не найдено</p>;
  }

  return (
    <div className={styles.list}>
      {users.map((user) => (
        <ContactCard
          key={user.id}
          user={user}
          isFavorite={isFavorite(user.id)}
          onToggleFavorite={() => onToggleFavorite(user.id)}
        />
      ))}
    </div>
  );
}
