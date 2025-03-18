import React from 'react';
import ReactDOM from 'react-dom/client'; // Importe createRoot do react-dom/client
import App from './App';
import { PedidosProvider } from './context/PedidosContext';

// Crie a raiz da aplicação
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderize o App dentro do PedidosProvider
root.render(
  <React.StrictMode>
    <PedidosProvider>
      <App />
    </PedidosProvider>
  </React.StrictMode>
);