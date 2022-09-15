import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice';
import musicReducer from './musicSlice';
import itemReducer from './itemSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    music: musicReducer,
    item: itemReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;