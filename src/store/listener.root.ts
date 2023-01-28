import { createListenerMiddleware } from '@reduxjs/toolkit';
import { onAddOrUpdateCountDown } from './account/account.listen';

// Create the middleware instance and methods
export const listenerMiddleware = createListenerMiddleware();

// listenerMiddleware.startListening({
//   actionCreator: addOrUpdateCountDown,
//   effect: onAddOrUpdateCountDown,
// });
