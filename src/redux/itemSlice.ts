import { createSlice } from "@reduxjs/toolkit";
import { RibbitItem } from "../models/RibbitItem";
import { RootState } from "./store";

interface ItemState {
    item: RibbitItem;
}

const initialState: ItemState = {
    item: {} as RibbitItem
};

const ItemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        addItemDetails(state, action) {
            state.item = action.payload;
        },
        removeItemDetails(state, action) {
            state.item = {} as RibbitItem;
        }
    }
});

export const { addItemDetails, removeItemDetails } = ItemSlice.actions;

export const itemDetails = (state: RootState) => state.item.item;

export default ItemSlice.reducer;