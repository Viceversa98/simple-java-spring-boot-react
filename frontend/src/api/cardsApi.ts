/**
 * WHY: Thin HTTP client for the Spring Boot Kanban API. Centralizes the
 * base URL and JSON handling so components do not repeat fetch boilerplate.
 */
import type { Card, CardRequest, MoveCardRequest } from '../types/card';

/** WHY: Backend listens on 8080; Vite frontend talks to it cross-origin. */
const API_BASE = 'http://localhost:8080/api/cards';

/**
 * WHY: Shared response parser that surfaces API error bodies as Error
 * messages the UI can show in alerts/toasts.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

/** WHY: Load all cards for the board on mount and after mutations. */
export async function listCards(): Promise<Card[]> {
  const res = await fetch(API_BASE);
  return handleResponse<Card[]>(res);
}

/** WHY: Create a new card from the Add Card form. */
export async function createCard(body: CardRequest): Promise<Card> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<Card>(res);
}

/** WHY: Persist edits from the edit dialog. */
export async function updateCard(id: number, body: CardRequest): Promise<Card> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<Card>(res);
}

/** WHY: Move a card to another column/index after drag-drop or Move click. */
export async function moveCard(id: number, body: MoveCardRequest): Promise<Card> {
  const res = await fetch(`${API_BASE}/${id}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<Card>(res);
}

/** WHY: Remove a card when the user confirms delete. */
export async function deleteCard(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
