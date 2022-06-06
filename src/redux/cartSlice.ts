import { RibbitItem } from './../models/RibbitItem';
import { createSlice } from "@reduxjs/toolkit";
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
    remove(state, action) {
      state.items.splice(state.items.findIndex(item => item.id === action.payload.id), 1);
    },
    toggle(state) {
      state.open = !state.open;
    },
    empty(state) {
      state.items = [];
    }
  }
});

export const { add, remove, toggle, empty } = cartSlice.actions;

export const cartCount = (state: RootState) => state.cart.items.length;
export const cartOpen = (state: RootState) => state.cart.open;
export const cartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;