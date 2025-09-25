import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./Features/Store";
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
      <TooltipProvider>
    <App />
    </TooltipProvider>  
     <Toaster></Toaster>
    </PersistGate>
    </Provider>
  </StrictMode>
)
