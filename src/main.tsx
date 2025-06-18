
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Starting application...');

const container = document.getElementById("root");
if (!container) {
  console.error("Root element not found");
  throw new Error("Root element not found");
}

console.log('Root element found, initializing React app...');
createRoot(container).render(<App />);
