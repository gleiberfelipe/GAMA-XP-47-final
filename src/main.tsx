import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import store from './store'
import { Provider } from 'react-redux'
import { ClerkProvider } from '@clerk/clerk-react'
import { ptBR } from '@clerk/localizations'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={ptBR}>
    <App />
    </ClerkProvider>
    </Provider>
  </React.StrictMode>,
)
