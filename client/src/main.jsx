import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { UserContextProvider } from './Context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <BrowserRouter> 
        <App />
      </BrowserRouter>
    </UserContextProvider> 
  </StrictMode>,
)
