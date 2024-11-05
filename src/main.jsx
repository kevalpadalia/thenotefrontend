import React from 'react'
import ReactDOM from 'react-dom/client'
import store from './store';
import './styles.css'

// import { RouterProvider } from "react-router-dom";
// <RouterProvider router={router} />
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from './context/SocketContext';
// import router from './router'
import App from './App'
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <SocketProvider>
        <App />
      </SocketProvider>
    </BrowserRouter>
  </Provider>,
)
