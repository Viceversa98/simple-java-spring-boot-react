/**
 * WHY: One board column (To Do / In Progress / Done). Acts as a drop target
 * for HTML5 drag-and-drop and lists cards belonging to that status.
 */
import type { Card, CardStatus } from '../types/card';
import { CardItem } from './CardItem';

interface ColumnProps {
  title: string;
  status: CardStatus;
  cards: Card[];
  onAdd: (status: CardStatus) => void;
  onEdit: (card: Card) => void;
  onDelete: (id: number) => void;
  onMove: (id: number, status: CardStatus, position: number) => void;
  /** WHY: Highlight drop zone while dragging over this column. */
  onDropCard: (cardId: number, status: CardStatus, position: number) => void;
}

/**
 * WHY: Groups cards by status and wires drag-over/drop so moving a card
 * into this column updates status+position via the parent Board.
 */
export function Column({
  title,
  status,
  cards,
  onAdd,
  onEdit,
  onDelete,
  onMove,
  onDropCard,
}: ColumnProps) {
  const sorted = [...cards].sort((a, b) => a.position - b.position);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('text/plain'));
    if (!Number.isFinite(id)) return;
    // WHY: Drop at end of column by default for simple UX.
    onDropCard(id, status, sorted.length);
  };

  return (
    <section
      className={`column column-${status.toLowerCase()}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <header className="column-header">
        <h2>
          {title} <span className="badge">{sorted.length}</span>
        </h2>
        <button type="button" className="btn-add" onClick={() => onAdd(status)}>
          + Add
        </button>
      </header>
      <div className="column-body">
        {sorted.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
        {sorted.length === 0 && (
          <p className="column-empty">Drop cards here</p>
        )}
      </div>
    </section>
  );
}
