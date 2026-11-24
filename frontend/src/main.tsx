import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

console.info('%cVeli Child Academy', 'font-weight:bold;color:#1d2a5c', '\nWebsite designed and developed by Siphesihle Dlomo · https://github.com/Veja79');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
