import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import  { PersistGate } from 'redux-persist/integration/react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { store, persistor } from './configureStore.ts';
import Root from './routes/root.tsx';

store.subscribe(() => {
  const authorize_path = "/authorize"
  const redirect_uri = `${import.meta.env.VITE_LOGIN_REDIRECT_URI ?? window.location.origin}${authorize_path}`;
  if (!store.getState().auth.tokens && window.location.pathname !== authorize_path){
    window.location.href = `${import.meta.env.VITE_LOGIN_URL}&redirect_uri=${redirect_uri}`
  }
})

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
