package com.kanban.dto;

import com.kanban.model.CardStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * WHY: Request body for create/update so we do not expose the JPA entity
 * directly and can validate title/status before touching the database.
 */
public class CardRequest {

    /** WHY: Card must have a non-blank title to be useful on the board. */
    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    /** WHY: Optional notes; empty string is fine and stored as-is or null. */
    @Size(max = 2000)
    private String description;

    /**
     * WHY: Target column on create; on full update also accepted.
     * Defaults handled in the service if null on create.
     */
    private CardStatus status;

    /** WHY: Optional explicit position; service assigns next if omitted. */
    private Integer position;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CardStatus getStatus() {
        return status;
    }

    public void setStatus(CardStatus status) {
        this.status = status;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}
