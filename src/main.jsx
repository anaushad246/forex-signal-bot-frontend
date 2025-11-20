import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SignalProvider } from './context/SignalContext.jsx' // 1. Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SignalProvider> {/* 2. Wrap your App in the provider */}
        <App />
      </SignalProvider>
    </BrowserRouter>
  </React.StrictMode>,
)