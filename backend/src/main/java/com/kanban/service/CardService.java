package com.kanban.service;

import com.kanban.dto.CardRequest;
import com.kanban.dto.CardResponse;
import com.kanban.dto.MoveCardRequest;
import com.kanban.model.Card;
import com.kanban.model.CardStatus;
import com.kanban.repository.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * WHY: Business logic layer between the REST controller and JPA repository.
 * Encapsulates create/update/delete/move so the controller stays thin and
 * position reordering stays consistent inside transactions.
 */
@Service
public class CardService {

    private final CardRepository cardRepository;

    /** WHY: Constructor injection keeps the service easy to test and wire. */
    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * WHY: Return every card ordered for the board UI in one round-trip.
     */
    @Transactional(readOnly = true)
    public List<CardResponse> listAll() {
        return cardRepository.findAllByOrderByStatusAscPositionAsc()
                .stream()
                .map(CardResponse::from)
                .toList();
    }

    /**
     * WHY: Fetch a single card by id for edit forms / detail views.
     */
    @Transactional(readOnly = true)
    public CardResponse getById(Long id) {
        return CardResponse.from(findOrThrow(id));
    }

    /**
     * WHY: Persist a new card into a column, appending at the end unless
     * an explicit position is provided.
     */
    @Transactional
    public CardResponse create(CardRequest request) {
        CardStatus status = request.getStatus() != null ? request.getStatus() : CardStatus.TODO;
        int position = request.getPosition() != null
                ? request.getPosition()
                : nextPosition(status);

        Card card = new Card(
                request.getTitle().trim(),
                blankToNull(request.getDescription()),
                status,
                position
        );
        return CardResponse.from(cardRepository.save(card));
    }

    /**
     * WHY: Update title/description/status/position for an existing card
     * so the edit dialog can save changes without a separate move call.
     */
    @Transactional
    public CardResponse update(Long id, CardRequest request) {
        Card card = findOrThrow(id);
        card.setTitle(request.getTitle().trim());
        card.setDescription(blankToNull(request.getDescription()));
        if (request.getStatus() != null) {
            card.setStatus(request.getStatus());
        }
        if (request.getPosition() != null) {
            card.setPosition(request.getPosition());
        }
        return CardResponse.from(cardRepository.save(card));
    }

    /**
     * WHY: Drag-drop / Move-button path — change column and index, then
     * renumber siblings so positions stay contiguous and the board looks right.
     */
    @Transactional
    public CardResponse move(Long id, MoveCardRequest request) {
        Card card = findOrThrow(id);
        CardStatus oldStatus = card.getStatus();
        CardStatus newStatus = request.getStatus();
        int newPosition = Math.max(0, request.getPosition());

        // WHY: Temporarily park the card at a high position to avoid unique-ish
        // collisions while we shift other cards in source/target columns.
        card.setStatus(newStatus);
        card.setPosition(Integer.MAX_VALUE / 2);
        cardRepository.saveAndFlush(card);

        if (oldStatus == newStatus) {
            // WHY: Same-column reorder — shift cards between old and new index.
            List<Card> column = cardRepository.findByStatusOrderByPositionAsc(newStatus);
            column.removeIf(c -> c.getId().equals(id));
            newPosition = Math.min(newPosition, column.size());
            column.add(newPosition, card);
            renumber(column);
        } else {
            // WHY: Cross-column move — close the gap in the old column and
            // insert into the new column at the requested index.
            List<Card> oldColumn = cardRepository.findByStatusOrderByPositionAsc(oldStatus);
            oldColumn.removeIf(c -> c.getId().equals(id));
            // Also remove any leftover of this card if status already changed
            oldColumn.removeIf(c -> c.getId().equals(id));
            renumber(oldColumn);

            List<Card> newColumn = cardRepository.findByStatusOrderByPositionAsc(newStatus);
            newColumn.removeIf(c -> c.getId().equals(id));
            newPosition = Math.min(newPosition, newColumn.size());
            card.setStatus(newStatus);
            newColumn.add(newPosition, card);
            renumber(newColumn);
        }

        cardRepository.save(card);
        return CardResponse.from(card);
    }

    /**
     * WHY: Remove a card permanently when the user deletes it from the board.
     */
    @Transactional
    public void delete(Long id) {
        Card card = findOrThrow(id);
        CardStatus status = card.getStatus();
        cardRepository.delete(card);
        // WHY: Compact positions after delete so indices stay 0..n-1.
        List<Card> remaining = cardRepository.findByStatusOrderByPositionAsc(status);
        renumber(remaining);
    }

    /**
     * WHY: Shared lookup that maps missing ids to HTTP 404 for the API.
     */
    private Card findOrThrow(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found: " + id));
    }

    /**
     * WHY: Next free position at the bottom of a column for append creates.
     */
    private int nextPosition(CardStatus status) {
        return cardRepository.findMaxPositionByStatus(status).orElse(-1) + 1;
    }

    /**
     * WHY: Rewrite positions to 0,1,2,... after any structural change so
     * the frontend can rely on dense indices for drag-drop.
     */
    private void renumber(List<Card> cards) {
        for (int i = 0; i < cards.size(); i++) {
            Card c = cards.get(i);
            if (c.getPosition() == null || c.getPosition() != i) {
                c.setPosition(i);
                cardRepository.save(c);
            }
        }
    }

    /** WHY: Store null instead of blank so optional description stays clean. */
    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
