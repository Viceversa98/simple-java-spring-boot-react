/**
 * WHY: Top-level Kanban board — loads cards from the API, owns create/edit
 * modal state, and fans out mutations (create/update/move/delete) to columns.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  createCard,
  deleteCard,
  listCards,
  moveCard,
  updateCard,
} from '../api/cardsApi';
import type { Card, CardRequest, CardStatus } from '../types/card';
import { COLUMNS } from '../types/card';
import { CardModal } from './CardModal';
import { Column } from './Column';

/**
 * WHY: Single source of truth for board data in the browser; refresh after
 * every successful mutation so UI matches PostgreSQL.
 */
export function Board() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Card | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<CardStatus>('TODO');

  /** WHY: Fetch board state from Spring Boot; reusable after mutations. */
  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await listCards();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const openCreate = (status: CardStatus) => {
    setEditing(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (card: Card) => {
    setEditing(card);
    setDefaultStatus(card.status);
    setModalOpen(true);
  };

  /** WHY: Create or update depending on whether a card was selected for edit. */
  const handleSave = async (data: CardRequest) => {
    if (editing) {
      await updateCard(editing.id, data);
    } else {
      await createCard(data);
    }
    await refresh();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCard(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  /** WHY: Shared path for Move buttons and drag-drop onto a column. */
  const handleMove = async (id: number, status: CardStatus, position: number) => {
    try {
      await moveCard(id, { status, position });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Move failed');
    }
  };

  if (loading) {
    return <div className="board-status">Loading board…</div>;
  }

  return (
    <div className="board-wrap">
      {error && (
        <div className="banner-error" role="alert">
          {error}
          <button type="button" onClick={() => void refresh()}>
            Retry
          </button>
        </div>
      )}
      <div className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.status}
            title={col.title}
            status={col.status}
            cards={cards.filter((c) => c.status === col.status)}
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
            onMove={handleMove}
            onDropCard={handleMove}
          />
        ))}
      </div>
      {modalOpen && (
        <CardModal
          card={editing}
          defaultStatus={defaultStatus}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
