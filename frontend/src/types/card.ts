/**
 * WHY: Shared TypeScript types mirroring the Spring Boot API so the
 * frontend stays type-safe when listing, creating, editing, and moving cards.
 */

/** WHY: Matches backend CardStatus enum values used as column keys. */
export type CardStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

/** WHY: Shape returned by GET /api/cards and mutation responses. */
export interface Card {
  id: number;
  title: string;
  description: string | null;
  status: CardStatus;
  position: number;
  createdAt: string;
}

/** WHY: Payload for create/update forms posted to the API. */
export interface CardRequest {
  title: string;
  description?: string;
  status?: CardStatus;
  position?: number;
}

/** WHY: Payload for PATCH /api/cards/{id}/move after drag-drop or Move buttons. */
export interface MoveCardRequest {
  status: CardStatus;
  position: number;
}

/**
 * WHY: Column metadata for rendering the three board lanes with
 * human-friendly titles and consistent ordering.
 */
export const COLUMNS: { status: CardStatus; title: string }[] = [
  { status: 'TODO', title: 'To Do' },
  { status: 'IN_PROGRESS', title: 'In Progress' },
  { status: 'DONE', title: 'Done' },
];
