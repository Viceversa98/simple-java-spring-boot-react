package com.kanban.model;

/**
 * WHY: Fixed set of board columns. Using an enum prevents typos and keeps
 * frontend/backend status strings aligned (TODO, IN_PROGRESS, DONE).
 */
public enum CardStatus {
    /** WHY: Backlog / not started work. */
    TODO,
    /** WHY: Work currently being done. */
    IN_PROGRESS,
    /** WHY: Finished work. */
    DONE
}
