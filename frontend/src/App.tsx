/**
 * WHY: Root React component — shell chrome (header) plus the Kanban Board
 * that talks to the Spring Boot API.
 */
import { Board } from './components/Board';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Kanban Board</h1>
          <p className="subtitle">React + Spring Boot + PostgreSQL</p>
        </div>
        <a
          className="api-link"
          href="http://localhost:8080/api/cards"
          target="_blank"
          rel="noreferrer"
        >
          API
        </a>
      </header>
      <main>
        <Board />
      </main>
    </div>
  );
}

export default App;
