import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import useZoomAdjust from './hooks/useZoomAdjust';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
        {/* initialize zoom-adjust once via ZoomRunner */}
        <ZoomRunner />
        <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Run zoom adjust outside of React render to ensure it applies immediately.
// We call the hook-ish function behavior by creating a small root-level effect.
// eslint-disable-next-line react-hooks/rules-of-hooks
function ZoomRunner() {
  useZoomAdjust();
  return null;
}
