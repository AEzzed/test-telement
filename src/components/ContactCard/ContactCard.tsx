import type { User } from '../../types';
import styles from './ContactCard.module.css';

interface ContactCardProps {
  user: User;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 45%)`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ContactCard({ user, isFavorite, onToggleFavorite }: ContactCardProps) {
  const color = getColorFromName(user.name);
  const initials = getInitials(user.name);

  return (
    <article className={styles.card}>
      <div className={styles.avatar} style={{ backgroundColor: color }}>
        {initials}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{user.name}</h3>
        <p className={styles.email}>{user.email}</p>
        <p className={styles.city}>{user.address.city}</p>
      </div>
      <button
        className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
        onClick={onToggleFavorite}
        aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
    </article>
  );
}
