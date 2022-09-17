import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice';
import musicReducer from './musicSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    music: musicReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;