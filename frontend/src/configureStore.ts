import { configureStore, combineReducers, applyMiddleware } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
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
}

const persistedRootReducer = persistReducer(persistConfig, rootReducer)
const composedEnhancer = applyMiddleware(thunkMiddleware);

const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  enhancers: [composedEnhancer],
  devTools: true,
})

const persistor = persistStore(store);

export { store, persistor }
