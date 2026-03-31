import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockUsers = [
  { id: 1, name: 'Leanne Graham', email: 'leanne@example.com', address: { city: 'Gwenborough' } },
  { id: 2, name: 'Ervin Howell', email: 'ervin@example.com', address: { city: 'Wisokyburgh' } },
  { id: 3, name: 'Clementine Bauch', email: 'clementine@example.com', address: { city: 'McKenziehaven' } },
];

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('App', () => {
  it('показывает состояние загрузки', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<App />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('отображает список контактов после загрузки', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();
  });

  it('фильтрует контакты по поиску', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    } as Response);

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Поиск по имени...');
    await user.type(input, 'Ervin');

    await waitFor(() => {
      expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
      expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
      expect(screen.queryByText('Clementine Bauch')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('показывает сообщение если ничего не найдено', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    } as Response);

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Поиск по имени...');
    await user.type(input, 'НесуществующееИмя');

    await waitFor(() => {
      expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('показывает ошибку при неудачной загрузке', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Не удалось загрузить контакты')).toBeInTheDocument();
    });
  });
});
