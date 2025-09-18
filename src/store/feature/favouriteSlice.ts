import type { favouritePayload } from "@/api/cart/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FavouriteState {
  items: favouritePayload[];
}

const initialState: FavouriteState = {
  items: [],
};

export const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    addToFavourites: (
      state,
      action: { payload: favouritePayload & { qty: number } }
    ) => {
      const { productId, qty, ...rest } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.stockQTY += qty;
      } else {
        state.items.push({ ...rest, productId, stockQTY: qty });
      }
    },

    increasementQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.stockQTY += 1;
    },

    decreasementQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item && item.stockQTY > 1) {
        item.stockQTY -= 1;
      } else {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      }
    },

    removeFromFavourite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },

    clearFavourite: (state) => {
      state.items = [];
    },
  },
});

export const { addToFavourites, increasementQty, decreasementQty, removeFromFavourite, clearFavourite } = favouriteSlice.actions;

export default favouriteSlice.reducer;
