package com.kanban.dto;

import com.kanban.model.Card;
import com.kanban.model.CardStatus;

import java.time.Instant;

/**
 * WHY: Stable JSON shape returned to the React frontend so API contract
 * stays independent of JPA entity internals.
 */
public class CardResponse {

    private Long id;
    private String title;
    private String description;
    private CardStatus status;
    private Integer position;
    private Instant createdAt;

    /** WHY: Map entity → DTO in one place used by every controller method. */
    public static CardResponse from(Card card) {
        CardResponse r = new CardResponse();
        r.id = card.getId();
        r.title = card.getTitle();
        r.description = card.getDescription();
        r.status = card.getStatus();
        r.position = card.getPosition();
        r.createdAt = card.getCreatedAt();
        return r;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public CardStatus getStatus() {
        return status;
    }

    public Integer getPosition() {
        return position;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
