import { listenerMiddleware } from './listener.root';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { persistedReducer } from './reducer.root';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gdm) =>
    gdm({
      serializableCheck: false,
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
