package com.kanban.controller;

import com.kanban.dto.CardRequest;
import com.kanban.dto.CardResponse;
import com.kanban.dto.MoveCardRequest;
import com.kanban.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * WHY: REST facade under /api/cards so the React app can list, create,
 * update, move, and delete cards over HTTP without knowing about JPA.
 */
@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardService cardService;

    /** WHY: Inject the service that owns all card business rules. */
    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    /** WHY: Board load — GET all cards for the three columns. */
    @GetMapping
    public List<CardResponse> list() {
        return cardService.listAll();
    }

    /** WHY: Optional single-card fetch for edit prefill. */
    @GetMapping("/{id}")
    public CardResponse get(@PathVariable Long id) {
        return cardService.getById(id);
    }

    /** WHY: Create a new card from the "Add card" form. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CardResponse create(@Valid @RequestBody CardRequest request) {
        return cardService.create(request);
    }

    /** WHY: Save edits from the edit dialog (title/description/status). */
    @PutMapping("/{id}")
    public CardResponse update(@PathVariable Long id, @Valid @RequestBody CardRequest request) {
        return cardService.update(id, request);
    }

    /**
     * WHY: Dedicated move endpoint for drag-drop / Move buttons so status
     * and position update together without requiring full card payload.
     */
    @PatchMapping("/{id}/move")
    public CardResponse move(@PathVariable Long id, @Valid @RequestBody MoveCardRequest request) {
        return cardService.move(id, request);
    }

    /** WHY: Delete card when user confirms removal. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        cardService.delete(id);
    }
}
