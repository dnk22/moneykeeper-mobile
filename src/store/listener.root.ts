import { createListenerMiddleware } from '@reduxjs/toolkit';

// Create the middleware instance and methods
export const listenerMiddleware = createListenerMiddleware();

// listenerMiddleware.startListening({
//   actionCreator: addOrUpdateCountDown,
//   effect: onAddOrUpdateCountDown,
// });
