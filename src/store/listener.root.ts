import { createListenerMiddleware } from '@reduxjs/toolkit';
import { addOrUpdateCountDown } from './countDown/countDown.slice';
import { onAddOrUpdateCountDown } from './countDown/countDown.listener';

// Create the middleware instance and methods
export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addOrUpdateCountDown,
  effect: onAddOrUpdateCountDown,
});
