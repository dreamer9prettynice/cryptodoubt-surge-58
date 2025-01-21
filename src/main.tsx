import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// Manifest URL should point to your app's manifest
const manifestUrl = 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      walletsListSource={{
        url: manifestUrl,
        fallback: [
          {
            name: 'Tonkeeper',
            image: 'https://tonkeeper.com/assets/tonconnect-icon.png',
            tondns: 'tonkeeper.ton',
            aboutUrl: 'https://tonkeeper.com',
            universalUrl: 'https://app.tonkeeper.com/ton-connect',
            bridgeUrl: 'https://bridge.tonapi.io/bridge',
            platforms: ['ios', 'android', 'chrome', 'firefox', 'safari']
          }
        ]
      }}
    >
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);