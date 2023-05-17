import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import  { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from "react-router-dom";
import { store, persistor } from './configureStore.ts';
import { ApolloProvider   } from '@apollo/client';
import router from "./router.tsx";
import graphqlClient from "./lib/graphql/client";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={graphqlClient}>
          <RouterProvider router={router} />
        </ApolloProvider> 
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
