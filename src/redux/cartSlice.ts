import { RibbitItem } from './../models/RibbitItem';
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from './store';

interface CartState {
  items: RibbitItem[];
}
const initialState: CartState = {
  items: []
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add(state, action) {
      state.items.push(action.payload);
    }
  }
});

export const { add } = cartSlice.actions;

export const cartCount = (state: RootState) => state.cart.items.length;

export default cartSlice.reducer;