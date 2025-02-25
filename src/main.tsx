import './utils/buffer-polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        <App />
      </TonConnectUIProvider>
    </BrowserRouter>
  </ErrorBoundary>
);