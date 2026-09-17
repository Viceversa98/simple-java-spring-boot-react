/**
 * WHY: Modal dialog for creating and editing cards so the board stays
 * uncluttered while still collecting title, description, and status.
 */
import { useEffect, useState } from 'react';
import type { Card, CardRequest, CardStatus } from '../types/card';
import { COLUMNS } from '../types/card';

interface CardModalProps {
  /** WHY: null = create mode; Card = edit mode with prefilled fields. */
  card: Card | null;
  /** WHY: Default column when creating from a specific column's Add button. */
  defaultStatus: CardStatus;
  onClose: () => void;
  onSave: (data: CardRequest) => Promise<void>;
}

/**
 * WHY: Controlled form that validates title client-side before calling
 * the parent save handler (which hits the API).
 */
export function CardModal({ card, defaultStatus, onClose, onSave }: CardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<CardStatus>(defaultStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** WHY: Prefill when editing so users see current values immediately. */
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description ?? '');
      setStatus(card.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
    }
  }, [card, defaultStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-modal-title"
      >
        <h2 id="card-modal-title">{card ? 'Edit Card' : 'New Card'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title *
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              autoFocus
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={4}
            />
          </label>
          <label>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CardStatus)}
            >
              {COLUMNS.map((c) => (
                <option key={c.status} value={c.status}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
