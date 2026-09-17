/**
 * WHY: Vite/React entry — mounts <App /> into #root so the Kanban UI boots
 * when `npm run dev` serves the page.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
