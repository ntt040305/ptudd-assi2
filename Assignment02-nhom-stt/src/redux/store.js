import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice';
import roomReducer from './roomSlice';

export const store = configureStore({
  reducer: {
    bookings: bookingReducer,
    rooms: roomReducer,
  },
});
