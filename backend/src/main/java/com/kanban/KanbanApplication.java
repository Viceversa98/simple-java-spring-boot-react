package com.kanban;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * WHY: Entry point that boots the Spring context so the Kanban REST API,
 * JPA repositories, CORS config, and DataSeeder all start together.
 */
@SpringBootApplication
public class KanbanApplication {

    /**
     * WHY: Standard Spring Boot main — launches the embedded Tomcat on port 8080.
     */
    public static void main(String[] args) {
        SpringApplication.run(KanbanApplication.class, args);
    }
}
