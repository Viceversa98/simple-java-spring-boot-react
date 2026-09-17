package com.kanban.config;

import com.kanban.model.Card;
import com.kanban.model.CardStatus;
import com.kanban.repository.CardRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * WHY: On first start (empty DB) insert sample cards so the board is not
 * blank and API/frontend smoke tests have data to show immediately.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CardRepository cardRepository;

    /** WHY: Need the repository to check emptiness and insert seed rows. */
    public DataSeeder(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * WHY: Run once after Spring context is ready; skip if any cards exist
     * so restarts do not duplicate demo data.
     */
    @Override
    public void run(String... args) {
        if (cardRepository.count() > 0) {
            log.info("Kanban DB already has {} cards — skipping seed", cardRepository.count());
            return;
        }

        log.info("Seeding sample Kanban cards...");
        cardRepository.save(new Card(
                "Welcome to Kanban",
                "This is a sample card in To Do. Drag me or use Move buttons.",
                CardStatus.TODO,
                0
        ));
        cardRepository.save(new Card(
                "Set up the project",
                "Clone, start Postgres, run backend and frontend.",
                CardStatus.TODO,
                1
        ));
        cardRepository.save(new Card(
                "Build the API",
                "Spring Boot REST endpoints under /api/cards.",
                CardStatus.IN_PROGRESS,
                0
        ));
        cardRepository.save(new Card(
                "Design the board UI",
                "Three columns with create/edit/delete.",
                CardStatus.IN_PROGRESS,
                1
        ));
        cardRepository.save(new Card(
                "Choose the stack",
                "React + Vite + TypeScript, Spring Boot 3, PostgreSQL.",
                CardStatus.DONE,
                0
        ));
        log.info("Seeded {} sample cards", cardRepository.count());
    }
}
