import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import  { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from "react-router-dom";
import { store, persistor } from './configureStore.ts';
import router from "./router.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
