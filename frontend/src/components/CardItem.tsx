/**
 * WHY: Renders one Kanban card with drag handle, edit/delete actions, and
 * Move buttons so users can relocate cards without relying only on drag-drop.
 */
import type { Card, CardStatus } from '../types/card';
import { COLUMNS } from '../types/card';

interface CardItemProps {
  card: Card;
  /** WHY: Open the edit modal with this card's data. */
  onEdit: (card: Card) => void;
  /** WHY: Delete after user confirmation. */
  onDelete: (id: number) => void;
  /** WHY: Move to another column via buttons (accessibility / no-DnD fallback). */
  onMove: (id: number, status: CardStatus, position: number) => void;
}

/**
 * WHY: Presentational card component — keeps column markup clean and
 * encodes HTML5 drag payload so Column drop targets can read the card id.
 */
export function CardItem({ card, onEdit, onDelete, onMove }: CardItemProps) {
  /** WHY: Stash card id in the drag dataTransfer for HTML5 drop handlers. */
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(card.id));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <article
      className="card"
      draggable
      onDragStart={handleDragStart}
      title="Drag to another column"
    >
      <header className="card-header">
        <h3 className="card-title">{card.title}</h3>
        <div className="card-actions">
          <button type="button" className="btn-icon" onClick={() => onEdit(card)} title="Edit">
            ✎
          </button>
          <button
            type="button"
            className="btn-icon danger"
            onClick={() => {
              if (window.confirm(`Delete "${card.title}"?`)) {
                onDelete(card.id);
              }
            }}
            title="Delete"
          >
            ✕
          </button>
        </div>
      </header>
      {card.description && <p className="card-desc">{card.description}</p>}
      <footer className="card-footer">
        <span className="card-date">
          {new Date(card.createdAt).toLocaleDateString()}
        </span>
        <div className="move-btns">
          {/* WHY: Explicit Move buttons for users who prefer clicks over drag. */}
          {COLUMNS.filter((c) => c.status !== card.status).map((col) => (
            <button
              key={col.status}
              type="button"
              className="btn-move"
              onClick={() => onMove(card.id, col.status, 0)}
              title={`Move to ${col.title}`}
            >
              → {col.title}
            </button>
          ))}
        </div>
      </footer>
    </article>
  );
}
