package com.kanban.repository;

import com.kanban.model.Card;
import com.kanban.model.CardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * WHY: Spring Data JPA repository — gives CRUD plus custom queries for
 * listing by status/position and computing the next position without
 * hand-written SQL boilerplate.
 */
@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    /**
     * WHY: Load the full board ordered by column then position so the
     * frontend can group cards without extra sorting logic.
     */
    List<Card> findAllByOrderByStatusAscPositionAsc();

    /**
     * WHY: Find cards in one column ordered by position for move/reorder ops.
     */
    List<Card> findByStatusOrderByPositionAsc(CardStatus status);

    /**
     * WHY: When creating or moving into a column, place the card after
     * the current max position so it appears at the bottom by default.
     */
    @Query("SELECT COALESCE(MAX(c.position), -1) FROM Card c WHERE c.status = :status")
    Optional<Integer> findMaxPositionByStatus(CardStatus status);
}
