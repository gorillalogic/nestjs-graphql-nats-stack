import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AuthReducer from './reducers/AuthReducer.ts';
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  auth: AuthReducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
}

const persistedRootReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedRootReducer,
middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store);

export { store, persistor }
