package com.kanban.dto;

import com.kanban.model.CardStatus;
import jakarta.validation.constraints.NotNull;

/**
 * WHY: Dedicated payload for drag-drop / move actions so the client can
 * update status and position in one call without sending title/description.
 */
public class MoveCardRequest {

    /** WHY: Destination column after the move. */
    @NotNull(message = "Status is required")
    private CardStatus status;

    /** WHY: Destination index within that column (0-based). */
    @NotNull(message = "Position is required")
    private Integer position;

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
