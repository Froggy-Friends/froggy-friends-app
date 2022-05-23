import { RibbitItem } from './../models/RibbitItem';
import { createSlice, current } from "@reduxjs/toolkit";
import { RootState } from './store';

interface CartState {
  items: RibbitItem[];
  open: boolean;
}
const initialState: CartState = {
  items: [],
  open: false
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add(state, action) {
      if (state.items.findIndex(item => item.id === action.payload.id) === -1) {
        state.items.push(action.payload);
      }
    },
    toggle(state) {
      state.open = !state.open;
    }
  }
});

export const { add, toggle } = cartSlice.actions;

export const cartCount = (state: RootState) => state.cart.items.length;
export const cartOpen = (state: RootState) => state.cart.open;

export default cartSlice.reducer;