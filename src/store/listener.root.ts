// listenerMiddleware.ts
import { createListenerMiddleware, addListener, isAnyOf } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './index';
import { onAccountStatementListener } from './account/account.listen';
import { updateAccountStatement, removeAccountStatement } from './account/account.slice';

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();

listenerMiddleware.startListening({
  matcher: isAnyOf(updateAccountStatement, removeAccountStatement),
  effect: onAccountStatementListener,
});
